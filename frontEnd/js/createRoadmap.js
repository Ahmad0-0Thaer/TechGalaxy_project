document.addEventListener('DOMContentLoaded', function () {
  const roadmap = {
    title: '',
    category: '',
    description: '',
    tag: '',
    steps: [],
    coverImage: null,
    createdAt: new Date().toISOString()
  };
  function sendRoadmapToBackend(step) {
    const formData = new FormData();
    formData.append("Title", roadmap.title);
    formData.append("Category", roadmap.category);
    formData.append("Description", roadmap.description);
    formData.append("DifficultyLevel", selectedDifficulty);

    const tagInput = document.getElementById('roadmap-tag');
    if (tagInput && tagInput.value.trim()) {
      roadmap.tag = tagInput.value.trim(); // خذ القيمة المدخلة مباشرة
    }
    formData.append("Tag", roadmap.tag || "default-tag");

    if (step) {
      formData.append("StepTitle", step.title);
      formData.append("StepDescription", step.description);
    }



    // صورة الغلاف
    const fileInput = document.getElementById("roadmap-cover");
    if (fileInput && fileInput.files[0]) {
      formData.append("CoverImage", fileInput.files[0]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    fetch("https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/create-or-update", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: formData
    })

      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Saved successfully:", data);
        alert("Step added and roadmap saved!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to save roadmap.");
      });
  }

  // DOM elements
  const roadmapTitle = document.getElementById('roadmap-title');
  const roadmapCategory = document.getElementById('roadmap-category');
  const roadmapDescription = document.getElementById('roadmap-description');
  const roadmapTags = document.getElementById('roadmap-tag');
  const tagsContainer = document.getElementById('tag-container');
  const stepTitle = document.getElementById('step-title');
  const stepDescription = document.getElementById('step-description');
  const addStepBtn = document.getElementById('add-step-btn');
  const roadmapVisual = document.getElementById('roadmap-visual');
  const emptyState = document.getElementById('empty-state');
  const previewBtn = document.getElementById('preview-btn');
  const saveBtn = document.getElementById('save-btn');
  const previewContainer = document.getElementById('preview-container');
  const closePreview = document.getElementById('close-preview');
  const previewTitle = document.getElementById('preview-title');
  const previewCategory = document.getElementById('preview-category');
  const previewTags = document.getElementById('preview-tag');
  const previewDescription = document.getElementById('preview-description');
  const previewSteps = document.getElementById('preview-steps');
  const progressFill = document.getElementById('progress-fill');
  const starsContainer = document.getElementById('stars-container');
  const roadmapCover = document.getElementById('roadmap-cover');
  const coverPreview = document.getElementById('cover-preview');
  const coverImage = document.getElementById('cover-image');
  const uploadCoverBtn = document.getElementById('upload-cover-btn');

  // Create twinkling stars
  function createStars() {
    const starsCount = 50;
    for (let i = 0; i < starsCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      star.style.setProperty('--opacity', Math.random() * 0.5 + 0.5);
      starsContainer.appendChild(star);
    }
  }

  createStars();

  // Update roadmap details
  roadmapTitle.addEventListener('input', () => {
    roadmap.title = roadmapTitle.value;
    updateProgress();
  });

  roadmapCategory.addEventListener('change', () => {
    roadmap.category = roadmapCategory.options[roadmapCategory.selectedIndex].text;
    updateProgress();
  });

  roadmapDescription.addEventListener('input', () => {
    roadmap.description = roadmapDescription.value;
    updateProgress();
  });

  // Tag functionality
  roadmapTags.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && roadmapTags.value.trim()) {
      e.preventDefault();
      const tag = roadmapTags.value.trim();
      roadmap.tag = tag;
      renderSingleTag(tag);
      roadmapTags.value = '';
    }
  });

  function renderSingleTag(tag) {
    tagsContainer.innerHTML = ''; // امسح القديم
    if (!tag) return;
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = tag;

    const removeBtn = document.createElement('span');
    removeBtn.className = 'tag-remove';
    removeBtn.textContent = '×';

    removeBtn.addEventListener('click', () => {
      roadmap.tag = '';
      tagsContainer.innerHTML = '';
    });

    tagElement.appendChild(removeBtn);
    tagsContainer.appendChild(tagElement);
  }

  window.removeTag = function (tag) {
    roadmap.tag = roadmap.tag.filter(t => t !== tag);
    renderTags();
  };

  let selectedDifficulty = 'intermediate'; // Default

  const difficultyRadios = document.querySelectorAll('input[name="difficultyLevel"]');

  difficultyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        selectedDifficulty = radio.value;
      }
    });
  });

  // اجعل "intermediate" مفعّلة افتراضياً
  document.getElementById('diff-intermediate').checked = true;


  // Set intermediate as default
  document.querySelector('.difficulty-btn.medium').classList.add('active');

  // Add new step
  addStepBtn.addEventListener('click', addStep);

  // Handle Enter key in step title
  stepTitle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addStep();
    }
  });

  function addStep() {
    const title = stepTitle.value.trim();
    const description = stepDescription.value.trim();

    if (!title) {
      alert('Please enter a step title');
      return;
    }

    const newStep = {
      id: Date.now(),
      title,
      description,
      difficulty: selectedDifficulty,
      resources: []
    };

    roadmap.steps.push(newStep);
    renderSteps();
    updateProgress();
    sendRoadmapToBackend(newStep);

    // Clear inputs
    stepTitle.value = '';
    stepDescription.value = '';
    stepTitle.focus();
  }

  // Render all steps
  function renderSteps() {
    // 1. احذف كل العناصر السابقة
    const existingSteps = roadmapVisual.querySelectorAll('.step-card');
    existingSteps.forEach(step => step.remove());

    // 2. تحقق إذا في خطوات
    if (roadmap.steps.length === 0) {
      emptyState.style.display = 'block';
      return;
    } else {
      emptyState.style.display = 'none';
    }

    // 3. أضف كل خطوة جديدة للواجهة
    roadmap.steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'step-card new';
      stepElement.dataset.id = step.id;
      stepElement.draggable = true;

      let difficultyColor = '';
      if (step.difficulty === 'beginner') difficultyColor = 'var(--success)';
      if (step.difficulty === 'intermediate') difficultyColor = 'var(--warning)';
      if (step.difficulty === 'advanced') difficultyColor = 'var(--danger)';

      stepElement.innerHTML = `
        <div class="step-number">${index + 1}</div>
        <div class="step-header">
          <div class="step-title" contenteditable="false">${step.title}</div>
          <div class="step-actions">
            <button class="action-btn edit-step" title="Edit step">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="action-btn delete-step" title="Delete step">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="step-description" contenteditable="false">${step.description}</div>
        <div class="difficulty-indicator" style="background: ${difficultyColor}"></div>
        <div class="edit-controls" style="display: none;">
          <button class="btn btn-primary save-edit">Save</button>
          <button class="btn btn-secondary cancel-edit">Cancel</button>
        </div>
      `;

      // Add edit functionality
      const editBtn = stepElement.querySelector('.edit-step');
      const titleElement = stepElement.querySelector('.step-title');
      const descriptionElement = stepElement.querySelector('.step-description');
      const editControls = stepElement.querySelector('.edit-controls');
      const saveBtn = stepElement.querySelector('.save-edit');
      const cancelBtn = stepElement.querySelector('.cancel-edit');

      let originalTitle = step.title;
      let originalDescription = step.description;

      editBtn.addEventListener('click', () => {
        // Enable editing
        titleElement.contentEditable = true;
        descriptionElement.contentEditable = true;
        editControls.style.display = 'flex';
        editBtn.style.display = 'none';

        // Focus on title
        titleElement.focus();
      });

      saveBtn.addEventListener('click', () => {
        const newTitle = titleElement.textContent.trim();
        const newDescription = descriptionElement.textContent.trim();

        if (!newTitle) {
          alert('Title cannot be empty');
          return;
        }

        if (step.id) {
          // Update in backend
          fetch(`https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Fields/${step.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              title: newTitle,
              description: newDescription
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to update step');
              }
              // Update local data
              step.title = newTitle;
              step.description = newDescription;
              // Disable editing
              titleElement.contentEditable = false;
              descriptionElement.contentEditable = false;
              editControls.style.display = 'none';
              editBtn.style.display = 'block';
            })
            .catch(error => {
              console.error('Error updating step:', error);
              alert('Failed to update step. Please try again.');
              // Revert changes
              titleElement.textContent = originalTitle;
              descriptionElement.textContent = originalDescription;
            });
        } else {
          // Update local data only
          step.title = newTitle;
          step.description = newDescription;
          // Disable editing
          titleElement.contentEditable = false;
          descriptionElement.contentEditable = false;
          editControls.style.display = 'none';
          editBtn.style.display = 'block';
        }
      });

      cancelBtn.addEventListener('click', () => {
        // Revert changes
        titleElement.textContent = originalTitle;
        descriptionElement.textContent = originalDescription;
        // Disable editing
        titleElement.contentEditable = false;
        descriptionElement.contentEditable = false;
        editControls.style.display = 'none';
        editBtn.style.display = 'block';
      });

      // Add delete functionality
      const deleteBtn = stepElement.querySelector('.delete-step');
      deleteBtn.addEventListener('click', () => {
        if (step.id) {
          // If the step has an ID, delete it from the backend
          fetch(`https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Fields/${step.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to delete step');
              }
              // Remove step from local array
              roadmap.steps = roadmap.steps.filter(s => s.id !== step.id);
              renderSteps();
              updateProgress();
            })
            .catch(error => {
              console.error('Error deleting step:', error);
              alert('Failed to delete step. Please try again.');
            });
        } else {
          // If the step doesn't have an ID (not yet saved), just remove it from local array
          roadmap.steps = roadmap.steps.filter(s => s !== step);
          renderSteps();
          updateProgress();
        }
      });

      roadmapVisual.appendChild(stepElement);
    });
  }

  // Edit step functionality
  window.editStep = function (stepId) {
    const step = roadmap.steps.find(s => s.id === stepId);
    if (!step) return;

    // Fill the form with step data
    stepTitle.value = step.title;
    stepDescription.value = step.description;



    selectedDifficulty = step.difficulty;

    // Remove the step being edited
    roadmap.steps = roadmap.steps.filter(s => s.id !== stepId);
    renderSteps();
  };

  // Drag and drop functionality
  let draggedItem = null;

  function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('over');
    return false;
  }

  function handleDragLeave() {
    this.classList.remove('over');
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('over');

    if (draggedItem !== this) {
      // Get IDs
      const draggedId = parseInt(draggedItem.dataset.id);
      const targetId = parseInt(this.dataset.id);

      // Find indexes
      const draggedIndex = roadmap.steps.findIndex(step => step.id === draggedId);
      const targetIndex = roadmap.steps.findIndex(step => step.id === targetId);

      // Reorder array
      const [removed] = roadmap.steps.splice(draggedIndex, 1);
      roadmap.steps.splice(targetIndex, 0, removed);

      // Re-render
      renderSteps();
    }

    return false;
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.step-card').forEach(card => {
      card.classList.remove('over');
    });
  }

  // Add resource to step (global function)
  window.addResource = function (stepId) {
    const step = roadmap.steps.find(s => s.id === stepId);
    const input = document.getElementById(`resource-input-${stepId}`);
    const resource = input.value.trim();

    if (!resource) return;

    // Simple URL validation
    if (!resource.startsWith('http://') && !resource.startsWith('https://')) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }

    step.resources.push(resource);
    renderSteps();
    input.value = '';
  };

  // Remove resource from step (global function)
  window.removeResource = function (stepId, resource) {
    const step = roadmap.steps.find(s => s.id === stepId);
    step.resources = step.resources.filter(r => r !== resource);
    renderSteps();
  };

  // Delete step (global function)
  window.deleteStep = function (stepId) {
    if (confirm('Are you sure you want to delete this step?')) {
      roadmap.steps = roadmap.steps.filter(s => s.id !== stepId);
      renderSteps();
      updateProgress();
    }
  };

  // Preview functionality
  previewBtn.addEventListener('click', showPreview);
  closePreview.addEventListener('click', hidePreview);

  function showPreview() {
    if (roadmap.steps.length === 0) {
      alert('Please add at least one step to preview');
      return;
    }

    previewTitle.textContent = roadmap.title || 'Untitled Roadmap';
    previewCategory.textContent = roadmap.category || 'Uncategorized';
    previewDescription.textContent = roadmap.description || 'No description provided';

    // Add cover image to preview if exists
    if (roadmap.coverImage) {
      const previewCover = document.createElement('img');
      previewCover.src = roadmap.coverImage;
      previewCover.style.width = '100%';
      previewCover.style.height = '200px';
      previewCover.style.objectFit = 'cover';
      previewCover.style.borderRadius = '10px';
      previewCover.style.marginBottom = '1rem';
      previewSteps.insertBefore(previewCover, previewSteps.firstChild);
    }

    // Render tag in preview
    previewTags.innerHTML = '';
    if (roadmap.tag) {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = roadmap.tag;
      previewTags.appendChild(tagElement);
    }

    // Clear previous preview steps
    previewSteps.innerHTML = '';

    // Add steps to preview
    roadmap.steps.forEach((step, index) => {
      // Difficulty indicator color
      let difficultyColor = '';
      if (step.difficulty === 'beginner') difficultyColor = 'var(--success)';
      if (step.difficulty === 'intermediate') difficultyColor = 'var(--warning)';
      if (step.difficulty === 'advanced') difficultyColor = 'var(--danger)';

      const stepElement = document.createElement('div');
      stepElement.className = 'preview-step';
      stepElement.innerHTML = `
            <div class="preview-step-number">${index + 1}</div>
            <div class="preview-step-title">${step.title}</div>
            <div class="preview-step-description">${step.description || 'No description provided'}</div>
            <div style="margin-top: 10px; display: inline-flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${difficultyColor}; margin-right: 5px;"></span>
              ${step.difficulty.charAt(0).toUpperCase() + step.difficulty.slice(1)}
            </div>
            ${step.resources.length > 0 ? `
              <div class="preview-resources">
                <div class="preview-resources-title">Resources</div>
                <div class="preview-resources-list">
                  ${step.resources.map(resource => `
                    <div class="preview-resource">
                      <a href="${resource}" target="_blank">${resource}</a>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          `;
      previewSteps.appendChild(stepElement);
    });

    previewContainer.classList.add('show');
  }

  function hidePreview() {
    previewContainer.classList.remove('show');
  }

  // Save functionality
  saveBtn.addEventListener('click', saveRoadmap);

  function saveRoadmap() {
    if (roadmap.steps.length === 0) {
      alert('Please add at least one step to save');
      return;
    }

    if (!roadmap.title) {
      alert('Please add a title for your roadmap');
      return;
    }

    // In a real app, you would send this to a server
    console.log('Roadmap saved:', roadmap);

    alert(`Roadmap "${roadmap.title}" saved successfully!`);

    // Save to localStorage for demo purposes
    localStorage.setItem('lastRoadmap', JSON.stringify(roadmap));
  }




  function exportToMarkdown() {
    if (roadmap.steps.length === 0) {
      alert('Please add at least one step to export');
      return;
    }

    let markdown = `# ${roadmap.title || 'Untitled Roadmap'}\n\n`;
    markdown += `**Category:** ${roadmap.category || 'Uncategorized'}\n\n`;

    if (roadmap.tag.length > 0) {
      markdown += `**Tag:** ${roadmap.tag.map(t => `\`${t}\``).join(', ')}\n\n`;
    }

    markdown += `## Description\n${roadmap.description || 'No description provided'}\n\n`;
    markdown += `## Learning Path\n`;

    roadmap.steps.forEach((step, index) => {
      markdown += `### ${index + 1}. ${step.title}\n`;
      markdown += `**Difficulty:** ${step.difficulty.charAt(0).toUpperCase() + step.difficulty.slice(1)}\n\n`;
      markdown += `${step.description || 'No description provided'}\n\n`;

      if (step.resources.length > 0) {
        markdown += `#### Resources\n`;
        step.resources.forEach(resource => {
          markdown += `- [${resource}](${resource})\n`;
        });
        markdown += '\n';
      }
    });

    // Create download link
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.title || 'roadmap'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportToJson() {
    if (roadmap.steps.length === 0) {
      alert('Please add at least one step to export');
      return;
    }

    const data = {
      ...roadmap,
      exportedAt: new Date().toISOString()
    };

    // Create download link
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.title || 'roadmap'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportToPng() {
    alert('In a real implementation, this would use a library like html2canvas to export the roadmap as an image.');
    // Example implementation would look like:
    // html2canvas(document.querySelector('.roadmap-visual')).then(canvas => {
    //   const link = document.createElement('a');
    //   link.download = 'roadmap.png';
    //   link.href = canvas.toDataURL('image/png');
    //   link.click();
    // });
  }

  // Progress calculation
  function updateProgress() {
    let progress = 0;

    // Cover Image = 10%
    if (roadmap.coverImage) progress += 10;

    // Title = 20%
    if (roadmap.title) progress += 20;

    // Category = 15%
    if (roadmap.category) progress += 15;

    // Description = 15%
    if (roadmap.description) progress += 15;

    // Steps = 40% (8% per step, max 5 steps)
    progress += Math.min(roadmap.steps.length * 8, 40);

    progressFill.style.width = `${progress}%`;
  }

  // Load from localStorage if available
  const lastRoadmap = localStorage.getItem('lastRoadmap');
  if (lastRoadmap) {
    const confirmLoad = confirm('Would you like to continue your last roadmap?');
    if (confirmLoad) {
      const loadedData = JSON.parse(lastRoadmap);

      // Basic validation
      if (loadedData.title) roadmap.title = loadedData.title;
      if (loadedData.category) roadmap.category = loadedData.category;
      if (loadedData.description) roadmap.description = loadedData.description;
      if (loadedData.steps) roadmap.steps = loadedData.steps;
      if (loadedData.coverImage) roadmap.coverImage = loadedData.coverImage;
      if (loadedData.tag) {
        roadmap.tag = loadedData.tag;
        renderSingleTag(roadmap.tag); // ✅ إضافة التاغ إلى الواجهة
      }
      // Update form fields
      roadmapTitle.value = roadmap.title;
      roadmapDescription.value = roadmap.description;

      // Set the category select
      if (roadmap.category) {
        const options = Array.from(roadmapCategory.options);
        const option = options.find(opt => opt.text === roadmap.category);
        if (option) {
          roadmapCategory.value = option.value;
        }
      }

      renderSteps();
      updateProgress();
    }
  }

  // Cover image upload functionality
  uploadCoverBtn.addEventListener('click', () => {
    roadmapCover.click();
  });

  coverPreview.addEventListener('click', () => {
    roadmapCover.click();
  });

  roadmapCover.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          coverImage.src = e.target.result;
          coverImage.style.display = 'block';
          document.querySelector('.upload-placeholder').style.display = 'none';
          roadmap.coverImage = e.target.result;
          updateProgress();
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  });
});
const fileInput = document.getElementById('roadmap-cover');
const uploadBtn = document.getElementById('upload-cover-btn');
const coverImage = document.getElementById('cover-image');
const coverPreview = document.getElementById('cover-preview');
const placeholder = coverPreview.querySelector('.upload-placeholder');

uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

placeholder.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      coverImage.src = e.target.result;
      coverImage.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// Toggle active class for difficulty buttons
document.querySelectorAll('input[name="difficultyLevel"]').forEach(radio => {
  radio.addEventListener('change', () => {
    // Remove active class from all labels
    document.querySelectorAll('.difficulty-btn').forEach(label => {
      label.classList.remove('active');
    });

    // Add active class to the selected label
    const selectedLabel = document.querySelector(`label[for="${radio.id}"]`);
    selectedLabel.classList.add('active');
  });
});


function postRoadmap() {
  fetch('https://techgalaxy-ejdjesbvb4d6h9dd.israelcentral-01.azurewebsites.net/api/Roadmaps/create-or-update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roadmap)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Roadmap sent successfully:', data);
      alert('Step added and roadmap saved!');
    })
    .catch(error => {
      console.error('Error sending roadmap:', error);
      alert('Failed to save roadmap.');
    });
}