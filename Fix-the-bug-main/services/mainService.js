const {readData,writeData}=require("../utils/fileStorage")
const idGen=require("../utils/idGenerator")
const cryptoService=require("./cryptoService")

const FILE="data/data.json"

function badRequest(message){
const err=new Error(message)
err.status=400
return err
}

function sanitize(item){
return {
id:item.id,
title:item.title,
ownerId:item.ownerId
}
}

exports.create=function(data,ownerId){

if(!data||typeof data.title!=="string"||typeof data.secret!=="string"){
throw badRequest("title and secret are required")
}

const title=data.title.trim()
const secret=data.secret.trim()

if(!title||!secret){
throw badRequest("title and secret cannot be empty")
}

if(!ownerId) throw badRequest("owner is required")

const list=readData(FILE)

const item={
id:idGen(),
title,
secret:cryptoService.encrypt(secret),
ownerId
}

list.push(item)

writeData(FILE,list)

return sanitize(item)

}

exports.list=function(ownerId){
if(!ownerId) throw badRequest("owner is required")

return readData(FILE)
.filter(i=>i.ownerId===ownerId)
.map(sanitize)
}

exports.remove=function(id,ownerId){

if(!ownerId) throw badRequest("owner is required")

const normalizedId=String(id)

const list=readData(FILE)
const existing=list.find(i=>String(i.id)===normalizedId)

if(!existing){
return {ok:false,code:"NOT_FOUND"}
}

if(existing.ownerId!==ownerId){
return {ok:false,code:"FORBIDDEN"}
}

const newList=list.filter(i=>String(i.id)!==normalizedId)

writeData(FILE,newList)

return {ok:true}

}