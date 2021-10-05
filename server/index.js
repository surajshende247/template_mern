const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const User = require('./models/user.model')

const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://sharad123:sharad123@cluster0.7mshd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

app.post('/api/register', async(req, res) =>{
    console.log(req.body)
    try{
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({status: 'ok'})
    }catch(err){
        res.json({status: 'error', error: 'Duplicate email'})
    }
    res.json({status: 'ok'})    
})

app.post('/api/login', async(req, res) =>{    
   const user = await User.findOne({
        email: req.body.email,
        password:req.body.password
    })
    
    if(user){
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            }, 'secret123')
        return res.json({status: 'ok', user: token})
    }
    else{
        return res.json({status: 'error', user: false})
    }    
})

app.get('/api/quote', async(req, res) =>{    
    const token = req.headers['x-access-token']

    try{
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email

        const user = await User.findOne({email: email})

        return res.json({status: 'ok', quote: user.quote})
    }catch(err){
        console.error(err)
        res.json({status: 'error', error: 'invalid token'})
    }
   
   
     
     if(user){
         const token = jwt.sign(
             {
                 name: user.name,
                 email: user.email,
             }, 'secret123')
         return res.json({status: 'ok', user: token})
     }
     else{
         return res.json({status: 'error', user: false})
     }    
 })

 app.post('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ email: email },
			{ $set: { quote: req.body.quote } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.listen(1337, () => {
    console.log('Server Running on 1337')
})