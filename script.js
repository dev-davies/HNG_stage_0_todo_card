document.addEventListener('DOMContentLoaded', () => {
  const DEADLINE = new Date('2026-04-16T18:00:00Z');
  
  // Elements
  const elCard = document.getElementById('todo-card');
  const elTitle = document.getElementById('todo-title');
  const elDescription = document.getElementById('todo-description');
  const elTimeRemaining = document.getElementById('todo-time-remaining');
  const elStatus = document.getElementById('todo-status');
  const chkComplete = document.getElementById('todo-complete-1');
  const btnEdit = document.getElementById('btn-edit');
  const btnDelete = document.getElementById('btn-delete');
  
  let isCompleted = false;
  
  function updateTimeRemaining() {
    const nowMs       = Date.now();
    const diffMs      = DEADLINE.getTime() - nowMs;
    const isOverdue   = diffMs < 0;
    const absDiffMs   = Math.abs(diffMs);
    
    const diffMinutes = Math.floor(absDiffMs / 1000 / 60);
    const diffHours   = Math.floor(diffMinutes / 60);
    const diffDays    = Math.floor(diffHours / 24);
    
    // update ISO
    if (isOverdue) {
      elTimeRemaining.setAttribute('datetime', 'PT0S');
    } else {
      const isoHours   = diffHours % 24;
      const isoMinutes = diffMinutes % 60;
      elTimeRemaining.setAttribute('datetime', `P${diffDays}DT${isoHours}H${isoMinutes}M`);
    }
  
    let timeLabel = '';
    if (diffMinutes < 1) {
      timeLabel = 'Due now!';
    } else if (isOverdue) {
      if (diffHours < 1) {
        timeLabel = `Overdue by ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
      } else if (diffDays < 1) {
        timeLabel = `Overdue by ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
      } else {
        timeLabel = `Overdue by ${diffDays} day${diffDays === 1 ? '' : 's'}`;
      }
    } else {
      if (diffHours < 1) {
        timeLabel = `Due in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
      } else if (diffDays < 1) {
        timeLabel = `Due in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
      } else if (diffDays === 1) {
        timeLabel = 'Due tomorrow';
      } else {
        timeLabel = `Due in ${diffDays} days`;
      }
    }
    
    elTimeRemaining.textContent = timeLabel;
  }
  
  // init time remaining loop
  updateTimeRemaining();
  setInterval(updateTimeRemaining, 60000);
  
  // Handlers
  chkComplete.addEventListener('change', (e) => {
    isCompleted = e.target.checked;
    
    // Toggle Card classes
    if (isCompleted) {
      elCard.classList.add('opacity-80');
      // Title
      elTitle.classList.add('line-through', 'text-gray-400');
      elTitle.classList.remove('text-gray-900');
      // Description
      elDescription.classList.add('opacity-60');
      // Status
      elStatus.textContent = 'Done';
      elStatus.classList.remove('bg-blue-50', 'text-blue-700');
      elStatus.classList.add('bg-emerald-50', 'text-emerald-800');
    } else {
      elCard.classList.remove('opacity-80');
      // Title
      elTitle.classList.remove('line-through', 'text-gray-400');
      elTitle.classList.add('text-gray-900');
      // Description
      elDescription.classList.remove('opacity-60');
      // Status
      elStatus.textContent = 'In Progress';
      elStatus.classList.remove('bg-emerald-50', 'text-emerald-800');
      elStatus.classList.add('bg-blue-50', 'text-blue-700');
    }
  });
  
  btnEdit.addEventListener('click', () => {
    console.log('Edit clicked');
  });
  
  btnDelete.addEventListener('click', () => {
    alert('Delete clicked');
  });
});
