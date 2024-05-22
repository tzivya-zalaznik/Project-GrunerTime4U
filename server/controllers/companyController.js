
const Company = require("../models/Company")
const Watch = require("../models/Watch")

const createCompany = async (req,res) => {
    const {name} = req.body
    const imageUrl = req.file.path; 
    if(!name||!imageUrl)
        return res.status(400).json({ message: 'missing required feilds'})
    const company = await Company.create({name,imageUrl})
    if(company)
        return res.status(201).json({ message: 'New company created' })
    else
        return res.status(400).json({ message: 'Invalid company' })
}

const getAllCompanies = async (req,res) => {
    const company = await Company.find().lean()
    if(!company?.length)
        return res.status(400).json({ message: 'No company found' })
    res.json(company)
}

const getCompanyByID = async (req,res) => {
    const {id}=req.params
    const company=await Company.findById(id).lean()
    if(!company){
        return res.status(400).send(`There is no company with id:${id}  :(`)
    }
    res.json(company)
}

const updateCompany=async(req,res)=>{
    const { _id,name,isImgUpdate} = req.body
    if(!_id){
        return res.status(400).send("Missing required feilds")
    }
    const company = await Company.findById(_id).exec()
    if(!company){
        return res.status(400).send(`There is no company with id:${_id}  :(`)
    }
    if (isImgUpdate) {
        company.imageUrl = req.file.path;
        company.name=name
        await company.save()
        res.send(`${company.name} is updated`)
    }
    else {
        company.name=name
        await company.save()
        res.send(`${company.name} is updated`)
    }
}

const deleteCompany=async(req,res)=>{
    const{id}=req.params
    const company=await Company.findById(id).exec()
    const watches = await Watch.find().lean().populate('company', { name: 1 })
    const cantDelete=watches?.filter(w=>w.company?.name==company?.name)
    if(cantDelete.length>0){
        return res.status(403).send('Can`t delete this company')
    }
    if(!company){
        return res.status(400).send(`There is no company with id:${id}  :(`)
    }
    await company.deleteOne()
    res.send(`company ${company.name} is deleted`)
}

module.exports={createCompany,getAllCompanies,getCompanyByID,updateCompany,deleteCompany}