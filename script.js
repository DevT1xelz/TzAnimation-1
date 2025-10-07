const buttons = document.querySelectorAll('.anim-btn');
buttons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const type = btn.dataset.type;
    localStorage.setItem('animationType', type);
    window.location.href='animation.html';
  });
});
