document.addEventListener('DOMContentLoaded', function () {
  // حالة Roadmap الحالية
  let currentRoadmap = {
    id: Date.now(),
    title: '',
    category: '',
    description: '',
    difficulty: 'intermediate',
    coverImage: null,
    steps: [],
    createdAt: new Date().toISOString()
  };
  
  let isEditingRoadmap = false;
  let isEditingStep = false;
  let currentEditingStepId = null;

  // عناصر DOM
  const roadmapSetupSection = document.getElementById('roadmap-setup-section');
  const stepsSection = document.getElementById('steps-section');
  const nextToStepsBtn = document.getElementById('next-to-steps-btn');
  const backToRoadmapBtn = document.getElementById('back-to-roadmap-btn');
  const currentRoadmapTitle = document.getElementById('current-roadmap-title');
  const saveRoadmapBtn = document.getElementById('save-roadmap-btn');
  const updateRoadmapBtn = document.getElementById('update-roadmap-btn');
  const deleteRoadmapBtn = document.getElementById('delete-roadmap-btn');
  const saveAllBtn = document.getElementById('save-all-btn');
  const stepsList = document.getElementById('steps-list');

  // الانتقال بين الأقسام
  nextToStepsBtn.addEventListener('click', function() {
    if (!validateRoadmapBasicInfo()) return;
    
    roadmapSetupSection.style.display = 'none';
    stepsSection.style.display = 'block';
    currentRoadmapTitle.textContent = currentRoadmap.title;
  });

  backToRoadmapBtn.addEventListener('click', function() {
    roadmapSetupSection.style.display = 'block';
    stepsSection.style.display = 'none';
  });

  // التحقق من المعلومات الأساسية للRoadmap
  function validateRoadmapBasicInfo() {
    if (!currentRoadmap.title.trim()) {
      alert('Please enter a roadmap title');
      return false;
    }
    
    if (!currentRoadmap.category) {
      alert('Please select a category');
      return false;
    }
    
    return true;
  }

  // حفظ Roadmap الأساسي
  saveRoadmapBtn.addEventListener('click', function() {
    if (!validateRoadmapBasicInfo()) return;
    
    // في تطبيق حقيقي، هنا سيتم إرسال البيانات للخادم
    console.log('Roadmap saved:', currentRoadmap);
    alert('Roadmap saved successfully!');
    
    // تمكين أزرار التعديل والحذف
    updateRoadmapBtn.disabled = false;
    deleteRoadmapBtn.disabled = false;
    isEditingRoadmap = false;
  });

  // تحديث Roadmap
  updateRoadmapBtn.addEventListener('click', function() {
    if (!validateRoadmapBasicInfo()) return;
    
    // في تطبيق حقيقي، هنا سيتم تحديث البيانات في الخادم
    console.log('Roadmap updated:', currentRoadmap);
    alert('Roadmap updated successfully!');
    isEditingRoadmap = false;
  });

  // حذف Roadmap
  deleteRoadmapBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) {
      // في تطبيق حقيقي، هنا سيتم حذف البيانات من الخادم
      console.log('Roadmap deleted:', currentRoadmap);
      resetRoadmapForm();
      alert('Roadmap deleted successfully!');
    }
  });

  // إعادة تعيين النموذج
  function resetRoadmapForm() {
    currentRoadmap = {
      id: Date.now(),
      title: '',
      category: '',
      description: '',
      difficulty: 'intermediate',
      coverImage: null,
      steps: [],
      createdAt: new Date().toISOString()
    };
    
    // إعادة تعيين حقول النموذج
    document.getElementById('roadmap-title').value = '';
    document.getElementById('roadmap-category').selectedIndex = 0;
    document.getElementById('roadmap-description').value = '';
    document.getElementById('cover-image').style.display = 'none';
    document.querySelector('.upload-placeholder').style.display = 'flex';
    
    // تعطيل أزرار التعديل والحذف
    updateRoadmapBtn.disabled = true;
    deleteRoadmapBtn.disabled = true;
    isEditingRoadmap = false;
    
    // إعادة تعيين قسم الخطوات
    stepsList.innerHTML = `
      <div class="empty-steps-message">
        <i class="fas fa-list-ul"></i>
        <p>No steps added yet. Start by adding your first step.</p>
      </div>
    `;
  }

  // تحديث بيانات Roadmap عند تغيير الحقول
  document.getElementById('roadmap-title').addEventListener('input', function() {
    currentRoadmap.title = this.value;
  });

  document.getElementById('roadmap-category').addEventListener('change', function() {
    currentRoadmap.category = this.options[this.selectedIndex].text;
  });

  document.getElementById('roadmap-description').addEventListener('input', function() {
    currentRoadmap.description = this.value;
  });

  // إدارة صورة الغلاف
  document.getElementById('roadmap-cover').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('cover-image').src = e.target.result;
        document.getElementById('cover-image').style.display = 'block';
        document.querySelector('.upload-placeholder').style.display = 'none';
        currentRoadmap.coverImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // إدارة مستوى الصعوبة
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentRoadmap.difficulty = this.dataset.level;
    });
  });

  // تعيين المستوى المتوسط كافتراضي
  document.querySelector('.difficulty-btn.medium').classList.add('active');

  // إدارة الخطوات
  document.getElementById('add-step-btn').addEventListener('click', addStep);

  function addStep() {
    const title = document.getElementById('step-title').value.trim();
    const description = document.getElementById('step-description').value.trim();
    const resource = document.getElementById('step-resource').value.trim();

    if (!title) {
      alert('Please enter a step title');
      return;
    }

    const newStep = {
      id: Date.now(),
      title,
      description,
      resource: resource || null,
      order: currentRoadmap.steps.length + 1
    };

    if (isEditingStep && currentEditingStepId) {
      // تحديث الخطوة الموجودة
      const index = currentRoadmap.steps.findIndex(step => step.id === currentEditingStepId);
      if (index !== -1) {
        currentRoadmap.steps[index] = {
          ...newStep,
          id: currentEditingStepId,
          order: currentRoadmap.steps[index].order
        };
      }
      isEditingStep = false;
      currentEditingStepId = null;
    } else {
      // إضافة خطوة جديدة
      currentRoadmap.steps.push(newStep);
    }

    renderSteps();
    resetStepForm();
  }

  function renderSteps() {
    if (currentRoadmap.steps.length === 0) {
      stepsList.innerHTML = `
        <div class="empty-steps-message">
          <i class="fas fa-list-ul"></i>
          <p>No steps added yet. Start by adding your first step.</p>
        </div>
      `;
      return;
    }

    stepsList.innerHTML = '';
    
    // ترتيب الخطوات حسب خاصية order
    const sortedSteps = [...currentRoadmap.steps].sort((a, b) => a.order - b.order);
    
    sortedSteps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'step-item';
      stepElement.dataset.id = step.id;
      stepElement.draggable = true;
      
      stepElement.innerHTML = `
        <div class="step-content">
          <div class="step-title">${index + 1}. ${step.title}</div>
          <div class="step-description">${step.description || 'No description'}</div>
          ${step.resource ? `
            <div class="step-resource">
              <a href="${step.resource}" target="_blank">${step.resource}</a>
            </div>
          ` : ''}
        </div>
        <div class="step-actions">
          <button class="step-action-btn edit" title="Edit step">
            <i class="fas fa-edit"></i>
          </button>
          <button class="step-action-btn delete" title="Delete step">
            <i class="fas fa-trash"></i>
          </button>
          <button class="step-action-btn move" title="Move step">
            <i class="fas fa-arrows-alt"></i>
          </button>
        </div>
      `;
      
      // أحداث التعديل والحذف
      stepElement.querySelector('.edit').addEventListener('click', () => editStep(step.id));
      stepElement.querySelector('.delete').addEventListener('click', () => deleteStep(step.id));
      
      // أحداث السحب والإفلات لإعادة الترتيب
      stepElement.addEventListener('dragstart', handleDragStart);
      stepElement.addEventListener('dragover', handleDragOver);
      stepElement.addEventListener('dragleave', handleDragLeave);
      stepElement.addEventListener('drop', handleDrop);
      stepElement.addEventListener('dragend', handleDragEnd);
      
      stepsList.appendChild(stepElement);
    });
  }

  function editStep(stepId) {
    const step = currentRoadmap.steps.find(s => s.id === stepId);
    if (!step) return;
    
    document.getElementById('step-title').value = step.title;
    document.getElementById('step-description').value = step.description;
    document.getElementById('step-resource').value = step.resource || '';
    
    isEditingStep = true;
    currentEditingStepId = stepId;
    document.getElementById('add-step-btn').innerHTML = '<i class="fas fa-save"></i> Update Step';
  }

  function deleteStep(stepId) {
    if (confirm('Are you sure you want to delete this step?')) {
      currentRoadmap.steps = currentRoadmap.steps.filter(step => step.id !== stepId);
      // تحديث ترتيب الخطوات المتبقية
      currentRoadmap.steps.forEach((step, index) => {
        step.order = index + 1;
      });
      renderSteps();
    }
  }

  function resetStepForm() {
    document.getElementById('step-title').value = '';
    document.getElementById('step-description').value = '';
    document.getElementById('step-resource').value = '';
    document.getElementById('add-step-btn').innerHTML = '<i class="fas fa-plus"></i> Add Step';
    document.getElementById('step-title').focus();
  }

  // إدارة السحب والإفلات لإعادة ترتيب الخطوات
  let draggedStep = null;

  function handleDragStart(e) {
    draggedStep = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drop-zone');
    return false;
  }

  function handleDragLeave() {
    this.classList.remove('drop-zone');
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('drop-zone');

    if (draggedStep !== this) {
      // الحصول على معرفات الخطوات
      const draggedId = parseInt(draggedStep.dataset.id);
      const targetId = parseInt(this.dataset.id);

      // العثور على الخطوات في المصفوفة
      const draggedIndex = currentRoadmap.steps.findIndex(step => step.id === draggedId);
      const targetIndex = currentRoadmap.steps.findIndex(step => step.id === targetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        // إعادة ترتيب المصفوفة
        const [removed] = currentRoadmap.steps.splice(draggedIndex, 1);
        currentRoadmap.steps.splice(targetIndex, 0, removed);

        // تحديث ترتيب جميع الخطوات
        currentRoadmap.steps.forEach((step, index) => {
          step.order = index + 1;
        });

        // إعادة عرض الخطوات
        renderSteps();
      }
    }

    return false;
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.step-item').forEach(item => {
      item.classList.remove('drop-zone');
    });
  }

  // إرسال Roadmap كاملة
  saveAllBtn.addEventListener('click', function() {
    if (currentRoadmap.steps.length === 0) {
      alert('Please add at least one step to submit');
      return;
    }

    // في تطبيق حقيقي، هنا سيتم إرسال البيانات للخادم
    console.log('Full roadmap submitted:', currentRoadmap);
    alert('Roadmap submitted successfully!');
    
    // إعادة تعيين النموذج بعد الإرسال
    resetRoadmapForm();
    roadmapSetupSection.style.display = 'block';
    stepsSection.style.display = 'none';
  });
});