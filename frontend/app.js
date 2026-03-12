async function create(event){
if(event) event.preventDefault();

const title=document.getElementById("title").value
const secret=document.getElementById("secret").value
const userId=document.getElementById("userId").value||"anonymous"

await fetch("/api/create",{
method:"POST",
headers:{
"Content-Type":"application/json",
"x-user-id":userId
},
body:JSON.stringify({title,secret})
})

load()

}

async function load(){

const userId=document.getElementById("userId").value||"anonymous"

const res=await fetch("/api/list",{
headers:{
"x-user-id":userId
}
})

const data=await res.json()

const container=document.getElementById("list")

container.textContent=""

data.forEach(d=>{

const row=document.createElement("div")
const label=document.createElement("p")
label.textContent=d.title

const button=document.createElement("button")
button.textContent="Delete"
button.onclick=async()=>{
await fetch(`/api/${encodeURIComponent(d.id)}`,{
method:"DELETE",
headers:{
"x-user-id":userId
}
})
load()
}

row.appendChild(label)
row.appendChild(button)
container.appendChild(row)

})

}

load()