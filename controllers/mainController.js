const service=require("../services/mainService")



function handleError(res,err){
const status=err.status||500
res.status(status).json({error:err.message||"internal server error"})
}

exports.create=(req,res)=>{
try{
const item=service.create(req.body,getUserId(req))
res.status(201).json(item)
}catch(err){
handleError(res,err)
}
}

exports.list=(req,res)=>{
try{
const data=service.list(getUserId(req))
res.json(data)
}catch(err){
handleError(res,err)
}
}

exports.remove=(req,res)=>{
try{
const result=service.remove(req.params.id,getUserId(req))

if(result.code==="NOT_FOUND") return res.status(404).json({error:"document not found"})
if(result.code==="FORBIDDEN") return res.status(403).json({error:"not allowed"})

res.json({message:"deleted"})
}catch(err){
handleError(res,err)
}
}