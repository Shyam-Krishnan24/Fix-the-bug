const crypto=require("crypto")

function getKey(){
const raw=process.env.DOC_SECRET_KEY

if(!raw){
const err=new Error("server is missing DOC_SECRET_KEY")
err.status=500
throw err
}

return crypto.createHash("sha256").update(raw).digest()
}

exports.encrypt=function(text){

if(typeof text!=="string"){
const err=new Error("secret must be a string")
err.status=400
throw err
}

const iv=crypto.randomBytes(12)
const cipher=crypto.createCipheriv("aes-256-gcm",getKey(),iv)

let encrypted=cipher.update(text,"utf8","hex")
encrypted+=cipher.final("hex")

const tag=cipher.getAuthTag().toString("hex")

return `${iv.toString("hex")}:${tag}:${encrypted}`

}