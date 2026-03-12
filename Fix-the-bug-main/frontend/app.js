// Show message feedback
function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = `message show ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove("show");
    }, 3000);
}

// Validate form inputs
function validateForm() {
    const title = document.getElementById("title").value.trim();
    const secret = document.getElementById("secret").value.trim();
    const userId = document.getElementById("userId").value.trim();
    
    if (!userId) {
        showMessage("❌ User ID is required", "error");
        return false;
    }
    
    if (!title) {
        showMessage("❌ Document title is required", "error");
        return false;
    }
    
    if (!secret) {
        showMessage("❌ Secret password is required", "error");
        return false;
    }
    
    if (secret.length < 4) {
        showMessage("❌ Secret must be at least 4 characters", "error");
        return false;
    }
    
    return true;
}

// Create document
async function create(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const title = document.getElementById("title").value.trim();
    const secret = document.getElementById("secret").value.trim();
    const userId = document.getElementById("userId").value.trim();
    
    try {
        const response = await fetch("/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": userId
            },
            body: JSON.stringify({ title, secret })
        });
        
        if (response.ok) {
            showMessage("✅ Document created successfully!", "success");
            document.getElementById("createForm").reset();
            document.getElementById("userId").value = userId; // Keep user ID
            load();
        } else {
            showMessage("❌ Failed to create document", "error");
        }
    } catch (error) {
        showMessage("❌ Error: " + error.message, "error");
        console.error("Create error:", error);
    }
}

// Load and display documents
async function load() {
    const userId = document.getElementById("userId").value || "anonymous";
    const container = document.getElementById("list");
    
    try {
        container.innerHTML = '<p class="loading">Loading documents...</p>';
        
        const res = await fetch("/api/list", {
            headers: {
                "x-user-id": userId
            }
        });
        
        const data = await res.json();
        
        container.innerHTML = "";
        
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>📭 No documents yet</p>
                    <p style="font-size: 0.9em;">Create your first document using the form above</p>
                </div>
            `;
            return;
        }
        
        data.forEach(d => {
            const card = document.createElement("div");
            card.className = "document-card";
            
            const info = document.createElement("div");
            info.className = "document-info";
            
            const titleElement = document.createElement("div");
            titleElement.className = "document-title";
            titleElement.textContent = d.title || "Untitled";
            
            const idElement = document.createElement("div");
            idElement.className = "document-id";
            idElement.textContent = `ID: ${d.id}`;
            
            info.appendChild(titleElement);
            info.appendChild(idElement);
            
            const actions = document.createElement("div");
            actions.className = "document-actions";
            
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-delete";
            deleteBtn.textContent = "🗑️ Delete";
            deleteBtn.onclick = async (e) => {
                e.preventDefault();
                await deleteDocument(d.id, userId);
            };
            
            actions.appendChild(deleteBtn);
            
            card.appendChild(info);
            card.appendChild(actions);
            container.appendChild(card);
        });
        
    } catch (error) {
        container.innerHTML = '<p class="loading" style="color: #ff6b6b;">Failed to load documents</p>';
        console.error("Load error:", error);
    }
}

// Delete document with confirmation
async function deleteDocument(id, userId) {
    if (confirm("⚠️ Are you sure you want to delete this document? This action cannot be undone.")) {
        try {
            const response = await fetch(`/api/${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: {
                    "x-user-id": userId
                }
            });
            
            if (response.ok) {
                showMessage("✅ Document deleted successfully!", "success");
                load();
            } else if (response.status === 403) {
                showMessage("❌ Unauthorized: You can only delete your own documents", "error");
            } else {
                showMessage("❌ Failed to delete document", "error");
            }
        } catch (error) {
            showMessage("❌ Error: " + error.message, "error");
            console.error("Delete error:", error);
        }
    }
}

// Auto-load documents on page load and when user ID changes
window.addEventListener("load", load);

document.getElementById("userId").addEventListener("change", load);
