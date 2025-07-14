// This file contains the JavaScript code for the gravestone shop webpage.
// It handles the functionality for selecting gravestone materials, displaying corresponding images,
// and managing the display of model details such as price and material.

let models = [];

async function loadModels() {
  const response = await fetch('data/models.json');
  models = await response.json();
}

function populateMaterialOptions() {
  const materialSelect = document.getElementById("material");
  materialSelect.innerHTML = `<option value="all">Todos</option>`;
  const materiales = [...new Set(models.map(m => m.material))];
  materiales.forEach(mat => {
    const option = document.createElement("option");
    option.value = mat;
    option.textContent = mat.charAt(0).toUpperCase() + mat.slice(1);
    materialSelect.appendChild(option);
  });
}

function animateOnScroll() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

function addLightboxEvents() {
  document.querySelectorAll('.model-gallery-item img').forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener('click', function() {
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      lightboxImg.src = this.src;
      lightbox.classList.add('active');
    });
  });

  document.getElementById('lightbox-close').onclick = function() {
    document.getElementById('lightbox').classList.remove('active');
    document.getElementById('lightbox-img').src = "";
  };

  // Cerrar lightbox al hacer click fuera de la imagen
  document.getElementById('lightbox').onclick = function(e) {
    if (e.target === this) {
      this.classList.remove('active');
      document.getElementById('lightbox-img').src = "";
    }
  };
}

// Llama a esta función después de renderizar los modelos
function updateModels() {
  const material = document.getElementById("material").value;
  const priceRange = document.getElementById("price-range").value;
  const modelList = document.getElementById("model-list");
  modelList.innerHTML = "";

  let filtered = models;

  if (material !== "all") {
    filtered = filtered.filter(m => m.material === material);
  }

  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
    filtered = filtered.filter(m => m.precio >= min && m.precio <= max);
  }

  if (filtered.length === 0) {
    modelList.innerHTML = "<p>No hay modelos disponibles para este filtro.</p>";
    return;
  }

  filtered.forEach(model => {
    const card = document.createElement("div");
    card.className = "model-gallery-item fade-in";
    card.innerHTML = `
      <img src="${model.imagen}" alt="${model.nombre}">
      <div class="model-info">
        <hr>
        <div class="model-title">${model.nombre}</div>
        <div class="model-meta">
          <span class="model-material">${model.material.charAt(0).toUpperCase() + model.material.slice(1)}</span>
          <span class="model-price">S/ ${model.precio}</span>
        </div>
      </div>
    `;
    modelList.appendChild(card);
  });
  animateOnScroll();
  addLightboxEvents();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadModels();
  populateMaterialOptions();
  updateModels();
  document.getElementById("material").addEventListener("change", updateModels);
  document.getElementById("price-range").addEventListener("change", updateModels);
});