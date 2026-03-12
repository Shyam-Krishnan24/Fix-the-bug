const fs=require("fs")
const pathLib=require("path")

function safePath(filePath){
const baseDir=pathLib.resolve(process.cwd(),"data")
const resolved=pathLib.resolve(process.cwd(),filePath)

if(!resolved.startsWith(baseDir+pathLib.sep)){
const err=new Error("invalid storage path")
err.status=400
throw err
}

if(pathLib.extname(resolved)!==".json"){
const err=new Error("invalid storage file type")
err.status=400
throw err
}

return resolved
}

exports.readData=function(filePath){

const resolved=safePath(filePath)

if(!fs.existsSync(resolved)) return []

const raw=fs.readFileSync(resolved,"utf8")

if(!raw.trim()) return []

try{
const parsed=JSON.parse(raw)
return Array.isArray(parsed)?parsed:[]
}catch(err){
const parseErr=new Error("data store is corrupted")
parseErr.status=500
throw parseErr
}

}

exports.writeData=function(filePath,data){

const resolved=safePath(filePath)

if(!Array.isArray(data)){
const err=new Error("invalid storage payload")
err.status=400
throw err
}

const dir=pathLib.dirname(resolved)
const name=pathLib.basename(resolved)
const tempPath=pathLib.join(dir,`${name}.tmp`)

fs.writeFileSync(tempPath,JSON.stringify(data,null,2),"utf8")
fs.renameSync(tempPath,resolved)

}