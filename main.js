const qrFields = ["First Name", "Last Name", "Company", "Email", "Title", "Phone", "Country"];
let customTemplate = [
  { label: "Interesado", type: "yesno" },
  { label: "Tipo de cliente", type: "select", options: ["Cliente", "Partner", "Otro"] },
  { label: "Comentarios", type: "text" }
];

function startScanner() {
  document.getElementById("qr-reader").innerHTML = "";
  const html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, (decodedText) => {
    html5QrCode.stop();
    parseQR(decodedText);
  });
}

function parseQR(text) {
  const lines = text.split(/\r?\n/);
  const data = {};
  lines.forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length > 0) {
      data[key.trim()] = rest.join(":").trim();
    }
  });
  populateForm(data);
}

function populateForm(data) {
  const qrFieldsDiv = document.getElementById("qr-fields");
  qrFieldsDiv.innerHTML = "";
  qrFields.forEach(field => {
    const value = data[field] || "";
    const input = `<label>${field}<input name="${field}" value="${value}" /></label>`;
    qrFieldsDiv.innerHTML += input;
  });

  const customFieldsDiv = document.getElementById("custom-fields");
  customFieldsDiv.innerHTML = "";
  customTemplate.forEach(f => {
    let html = "";
    if (f.type === "yesno") {
      html = `<label>${f.label}
        <select name="${f.label}">
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select></label>`;
    } else if (f.type === "select") {
      const opts = f.options.map(o => `<option value="${o}">${o}</option>`).join("");
      html = `<label>${f.label}<select name="${f.label}">${opts}</select></label>`;
    } else {
      html = `<label>${f.label}<input name="${f.label}" /></label>`;
    }
    customFieldsDiv.innerHTML += html;
  });

  document.getElementById("lead-form").style.display = "block";
}

function saveLead() {
  const inputs = document.querySelectorAll("#lead-form input, #lead-form select");
  const lead = {};
  inputs.forEach(input => lead[input.name] = input.value);
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  leads.push(lead);
  localStorage.setItem("leads", JSON.stringify(leads));
  document.getElementById("lead-form").reset();
  document.getElementById("lead-form").style.display = "none";
  updateLeadList();
}

function updateLeadList() {
  const list = document.getElementById("lead-list");
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  list.innerHTML = "";
  leads.forEach((lead, i) => {
    const li = document.createElement("li");
    li.textContent = lead["First Name"] + " " + lead["Last Name"] + " - " + lead["Email"];
    list.appendChild(li);
  });
}

function exportCSV() {
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  if (leads.length === 0) return;
  const headers = Object.keys(leads[0]);
  const csv = [headers.join(",")].concat(leads.map(l => headers.map(h => `"${l[h] || ""}"`).join(","))).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.csv";
  a.click();
}

function clearLeads() {
  if (confirm("¿Borrar todos los leads?")) {
    localStorage.removeItem("leads");
    updateLeadList();
  }
}

updateLeadList();