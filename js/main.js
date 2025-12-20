// 主交互脚本 - 高级动态效果版本

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollEffects();
  initParticles();
  initScrollAnimations();
  initCardEffects();
  initCursorGlow();
  initWechatModal();
  initContactForm();
  initThemeSwitcher();
});

/**
 * 初始化导航栏功能
 */
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const header = document.querySelector('.site-header');
  const links = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  if (!navToggle || !navLinks) return;

  // 移动端菜单展开/收起
  navToggle.addEventListener('click', function() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // 点击导航链接后关闭移动端菜单
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (window.innerWidth < 768) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }

      // 更新活动链接
      links.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 点击页面其他区域关闭移动端菜单
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 768) {
      const isClickInsideNav = navToggle.contains(e.target) || navLinks.contains(e.target);
      if (!isClickInsideNav && navLinks.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    }
  });

  // 窗口大小改变时重置菜单状态
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // 滚动时更新导航栏样式和活动链接
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        // 导航栏滚动效果
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        // 更新活动导航链接
        updateActiveNavLink(links, header);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * 更新活动导航链接
 */
function updateActiveNavLink(links, header) {
  const sections = document.querySelectorAll('section[id]');
  const headerHeight = header ? header.offsetHeight : 0;
  const scrollPos = window.scrollY + headerHeight + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}

/**
 * 初始化滚动效果
 */
function initScrollEffects() {
  // 视差滚动效果
  const glowOrbs = document.querySelectorAll('.glow-orb');
  
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    glowOrbs.forEach((orb, index) => {
      const speed = 0.1 + (index * 0.05);
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

/**
 * 初始化粒子背景
 */
function initParticles() {
  const particlesContainer = document.querySelector('.particles-bg');
  if (!particlesContainer) return;

  // 创建粒子
  const particleCount = window.innerWidth < 768 ? 20 : 50;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer);
  }
}

/**
 * 创建单个粒子
 */
function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // 随机位置
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  
  // 随机大小
  const size = Math.random() * 4 + 2;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  
  // 随机颜色
  const colors = ['#8B5CF6', '#06B6D4', '#F472B6', '#A78BFA'];
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  
  // 随机动画延迟和持续时间
  particle.style.animationDelay = Math.random() * 6 + 's';
  particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
  
  // 随机透明度
  particle.style.opacity = Math.random() * 0.5 + 0.1;
  
  container.appendChild(particle);
}

/**
 * 初始化滚动触发动画
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.hobby-card, .trait-card, .friend-type-card, .criteria-item'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 添加延迟动画
        setTimeout(() => {
          entry.target.classList.add('animate-visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    el.classList.add('animate-hidden');
    observer.observe(el);
  });

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    .animate-hidden {
      opacity: 0;
      transform: translateY(30px);
    }
    .animate-visible {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
}

/**
 * 初始化卡片鼠标跟随效果
 */
function initCardEffects() {
  const cards = document.querySelectorAll('.hobby-card, .trait-card, .friend-type-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 计算旋转角度
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
      
      // 添加光效跟随
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      card.style.background = `
        radial-gradient(circle at ${glowX}% ${glowY}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        rgba(255, 255, 255, 0.05)
      `;
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.background = '';
    });
  });
}

/**
 * 初始化鼠标光晕效果
 */
function initCursorGlow() {
  // 仅在桌面端启用
  if (window.innerWidth < 1024) return;
  
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);
  
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', function() {
    glow.style.opacity = '0';
  });
  
  // 平滑跟随动画
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}


/**
 * 初始化微信弹窗
 */
function initWechatModal() {
  // 创建弹窗HTML
  const modalHTML = `
    <div class="wechat-modal" id="wechat-modal">
      <div class="wechat-modal-content">
        <h3 class="wechat-modal-title">💬 添加微信好友</h3>
        <div class="wechat-id" id="wechat-id">wxlin52o1314</div>
        <p class="wechat-modal-hint">复制微信号，打开微信搜索添加</p>
        <div class="wechat-modal-buttons">
          <button class="modal-btn modal-btn-primary" id="copy-wechat-btn">复制微信号</button>
          <button class="modal-btn modal-btn-secondary" id="close-modal-btn">关闭</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('wechat-modal');
  const copyBtn = document.getElementById('copy-wechat-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const wechatCard = document.querySelector('.contact-card[aria-label="添加微信好友"]');

  if (wechatCard) {
    wechatCard.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const wechatId = 'wxlin52o1314';
      navigator.clipboard.writeText(wechatId).then(function() {
        copyBtn.textContent = '✓ 已复制';
        copyBtn.classList.add('copy-success');
        setTimeout(function() {
          copyBtn.textContent = '复制微信号';
          copyBtn.classList.remove('copy-success');
        }, 2000);
      }).catch(function() {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = wechatId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyBtn.textContent = '✓ 已复制';
        copyBtn.classList.add('copy-success');
        setTimeout(function() {
          copyBtn.textContent = '复制微信号';
          copyBtn.classList.remove('copy-success');
        }, 2000);
      });
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
    });
  }

  // 点击背景关闭
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // ESC键关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/**
 * 初始化联系表单
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusDiv = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // 获取表单数据
    const formData = {
      name: document.getElementById('sender-name').value.trim(),
      email: document.getElementById('sender-email').value.trim(),
      subject: document.getElementById('message-subject').value.trim(),
      message: document.getElementById('message-content').value.trim()
    };

    // 验证
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showStatus('error', '请填写所有必填项');
      return;
    }

    if (!isValidEmail(formData.email)) {
      showStatus('error', '请输入有效的邮箱地址');
      return;
    }

    // 显示加载状态
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    statusDiv.className = 'form-status';
    statusDiv.style.display = 'none';

    try {
      // 发送到后端API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showStatus('success', '🎉 留言发送成功！我会尽快回复你～');
        form.reset();
      } else {
        throw new Error(result.message || '发送失败');
      }
    } catch (error) {
      console.error('发送邮件失败:', error);
      // 如果后端不可用，使用mailto作为降级方案
      const mailtoLink = `mailto:linlongxiansheng@163.com?subject=${encodeURIComponent('[网站留言] ' + formData.subject)}&body=${encodeURIComponent(`来自: ${formData.name}\n邮箱: ${formData.email}\n\n${formData.message}`)}`;
      
      showStatus('error', '服务暂时不可用，点击下方按钮通过邮件客户端发送');
      
      // 添加备用发送按钮
      const fallbackBtn = document.createElement('a');
      fallbackBtn.href = mailtoLink;
      fallbackBtn.className = 'form-submit';
      fallbackBtn.style.display = 'inline-block';
      fallbackBtn.style.marginTop = '10px';
      fallbackBtn.style.textDecoration = 'none';
      fallbackBtn.style.textAlign = 'center';
      fallbackBtn.textContent = '📧 使用邮件客户端发送';
      
      if (!document.getElementById('fallback-btn')) {
        fallbackBtn.id = 'fallback-btn';
        statusDiv.after(fallbackBtn);
      }
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function showStatus(type, message) {
    statusDiv.className = 'form-status ' + type;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    
    // 移除之前的备用按钮
    const oldFallback = document.getElementById('fallback-btn');
    if (oldFallback && type === 'success') {
      oldFallback.remove();
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/**
 * 初始化主题自动切换
 */
function initThemeSwitcher() {
  // 12种精美主题配色（包含背景色和渐变）
  const themes = [
    {
      name: '梦幻紫',
      primary: '#8B5CF6',
      primaryLight: '#A78BFA',
      primaryRgb: '139, 92, 246',
      secondary: '#06B6D4',
      secondaryRgb: '6, 182, 212',
      accent: '#F472B6',
      accentRgb: '244, 114, 182',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      glowColor1: '#8B5CF6',
      glowColor2: '#F472B6',
      glowColor3: '#06B6D4',
      bgColor1: '#0F0F23',
      bgColor2: '#1A1A2E',
      bgColor3: '#16162a',
      bgGradient: 'linear-gradient(135deg, #0F0F23 0%, #1a1a3e 50%, #2d1b4e 100%)',
      navGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #0F0F23 0%, #1a1a3e 100%)',
      sectionGradient2: 'linear-gradient(180deg, #1A1A2E 0%, #2d1b4e 100%)'
    },
    {
      name: '海洋蓝',
      primary: '#0EA5E9',
      primaryLight: '#38BDF8',
      primaryRgb: '14, 165, 233',
      secondary: '#06B6D4',
      secondaryRgb: '6, 182, 212',
      accent: '#22D3EE',
      accentRgb: '34, 211, 238',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
      glowColor1: '#0EA5E9',
      glowColor2: '#06B6D4',
      glowColor3: '#22D3EE',
      bgColor1: '#0a1628',
      bgColor2: '#0f2137',
      bgColor3: '#0c1a2e',
      bgGradient: 'linear-gradient(135deg, #0a1628 0%, #0f2a40 50%, #0a2035 100%)',
      navGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.85) 0%, rgba(6, 182, 212, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #0a1628 0%, #0f2a40 100%)',
      sectionGradient2: 'linear-gradient(180deg, #0f2137 0%, #0a2035 100%)'
    },
    {
      name: '樱花粉',
      primary: '#EC4899',
      primaryLight: '#F472B6',
      primaryRgb: '236, 72, 153',
      secondary: '#F43F5E',
      secondaryRgb: '244, 63, 94',
      accent: '#FB7185',
      accentRgb: '251, 113, 133',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
      glowColor1: '#EC4899',
      glowColor2: '#F472B6',
      glowColor3: '#FB7185',
      bgColor1: '#1a0a14',
      bgColor2: '#2a1020',
      bgColor3: '#200d1a',
      bgGradient: 'linear-gradient(135deg, #1a0a14 0%, #2d1025 50%, #3a1530 100%)',
      navGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.85) 0%, rgba(244, 63, 94, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #1a0a14 0%, #2d1025 100%)',
      sectionGradient2: 'linear-gradient(180deg, #2a1020 0%, #3a1530 100%)'
    },
    {
      name: '翡翠绿',
      primary: '#10B981',
      primaryLight: '#34D399',
      primaryRgb: '16, 185, 129',
      secondary: '#14B8A6',
      secondaryRgb: '20, 184, 166',
      accent: '#2DD4BF',
      accentRgb: '45, 212, 191',
      gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      glowColor1: '#10B981',
      glowColor2: '#34D399',
      glowColor3: '#2DD4BF',
      bgColor1: '#0a1a14',
      bgColor2: '#0f2a20',
      bgColor3: '#0c201a',
      bgGradient: 'linear-gradient(135deg, #0a1a14 0%, #0f2d22 50%, #0a2a1c 100%)',
      navGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.85) 0%, rgba(20, 184, 166, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #0a1a14 0%, #0f2d22 100%)',
      sectionGradient2: 'linear-gradient(180deg, #0f2a20 0%, #0a2a1c 100%)'
    },
    {
      name: '日落橙',
      primary: '#F97316',
      primaryLight: '#FB923C',
      primaryRgb: '249, 115, 22',
      secondary: '#EAB308',
      secondaryRgb: '234, 179, 8',
      accent: '#FBBF24',
      accentRgb: '251, 191, 36',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EAB308 100%)',
      glowColor1: '#F97316',
      glowColor2: '#FB923C',
      glowColor3: '#FBBF24',
      bgColor1: '#1a120a',
      bgColor2: '#2a1c0f',
      bgColor3: '#20160c',
      bgGradient: 'linear-gradient(135deg, #1a120a 0%, #2d1f10 50%, #3a2815 100%)',
      navGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.85) 0%, rgba(234, 179, 8, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #1a120a 0%, #2d1f10 100%)',
      sectionGradient2: 'linear-gradient(180deg, #2a1c0f 0%, #3a2815 100%)'
    },
    {
      name: '极光青',
      primary: '#06B6D4',
      primaryLight: '#22D3EE',
      primaryRgb: '6, 182, 212',
      secondary: '#10B981',
      secondaryRgb: '16, 185, 129',
      accent: '#34D399',
      accentRgb: '52, 211, 153',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
      glowColor1: '#06B6D4',
      glowColor2: '#22D3EE',
      glowColor3: '#34D399',
      bgColor1: '#0a1618',
      bgColor2: '#0f2225',
      bgColor3: '#0c1c1e',
      bgGradient: 'linear-gradient(135deg, #0a1618 0%, #0f2830 50%, #0a2028 100%)',
      navGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.85) 0%, rgba(16, 185, 129, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #0a1618 0%, #0f2830 100%)',
      sectionGradient2: 'linear-gradient(180deg, #0f2225 0%, #0a2028 100%)'
    },
    {
      name: '玫瑰红',
      primary: '#E11D48',
      primaryLight: '#FB7185',
      primaryRgb: '225, 29, 72',
      secondary: '#BE123C',
      secondaryRgb: '190, 18, 60',
      accent: '#FDA4AF',
      accentRgb: '253, 164, 175',
      gradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
      glowColor1: '#E11D48',
      glowColor2: '#FB7185',
      glowColor3: '#FDA4AF',
      bgColor1: '#1a0a0e',
      bgColor2: '#2a0f16',
      bgColor3: '#200c12',
      bgGradient: 'linear-gradient(135deg, #1a0a0e 0%, #2d1018 50%, #3a1520 100%)',
      navGradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.85) 0%, rgba(190, 18, 60, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #1a0a0e 0%, #2d1018 100%)',
      sectionGradient2: 'linear-gradient(180deg, #2a0f16 0%, #3a1520 100%)'
    },
    {
      name: '星空靛',
      primary: '#6366F1',
      primaryLight: '#818CF8',
      primaryRgb: '99, 102, 241',
      secondary: '#8B5CF6',
      secondaryRgb: '139, 92, 246',
      accent: '#A78BFA',
      accentRgb: '167, 139, 250',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      glowColor1: '#6366F1',
      glowColor2: '#818CF8',
      glowColor3: '#A78BFA',
      bgColor1: '#0e0e1e',
      bgColor2: '#14142e',
      bgColor3: '#101026',
      bgGradient: 'linear-gradient(135deg, #0e0e1e 0%, #181838 50%, #201848 100%)',
      navGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(139, 92, 246, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #0e0e1e 0%, #181838 100%)',
      sectionGradient2: 'linear-gradient(180deg, #14142e 0%, #201848 100%)'
    },
    {
      name: '薄荷绿',
      primary: '#14B8A6',
      primaryLight: '#2DD4BF',
      primaryRgb: '20, 184, 166',
      secondary: '#0D9488',
      secondaryRgb: '13, 148, 136',
      accent: '#5EEAD4',
      accentRgb: '94, 234, 212',
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      glowColor1: '#14B8A6',
      glowColor2: '#2DD4BF',
      glowColor3: '#5EEAD4',
      bgColor1: '#0a1614',
      bgColor2: '#0f2220',
      bgColor3: '#0c1c1a',
      bgGradient: 'linear-gradient(135deg, #0a1614 0%, #0f2a26 50%, #0a2420 100%)',
      navGradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.85) 0%, rgba(13, 148, 136, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #0a1614 0%, #0f2a26 100%)',
      sectionGradient2: 'linear-gradient(180deg, #0f2220 0%, #0a2420 100%)'
    },
    {
      name: '琥珀金',
      primary: '#F59E0B',
      primaryLight: '#FBBF24',
      primaryRgb: '245, 158, 11',
      secondary: '#D97706',
      secondaryRgb: '217, 119, 6',
      accent: '#FCD34D',
      accentRgb: '252, 211, 77',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      glowColor1: '#F59E0B',
      glowColor2: '#FBBF24',
      glowColor3: '#FCD34D',
      bgColor1: '#1a140a',
      bgColor2: '#2a1e0f',
      bgColor3: '#20180c',
      bgGradient: 'linear-gradient(135deg, #1a140a 0%, #2d2210 50%, #3a2c15 100%)',
      navGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.85) 0%, rgba(217, 119, 6, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #1a140a 0%, #2d2210 100%)',
      sectionGradient2: 'linear-gradient(180deg, #2a1e0f 0%, #3a2c15 100%)'
    },
    {
      name: '紫罗兰',
      primary: '#7C3AED',
      primaryLight: '#8B5CF6',
      primaryRgb: '124, 58, 237',
      secondary: '#6D28D9',
      secondaryRgb: '109, 40, 217',
      accent: '#A78BFA',
      accentRgb: '167, 139, 250',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      glowColor1: '#7C3AED',
      glowColor2: '#8B5CF6',
      glowColor3: '#A78BFA',
      bgColor1: '#120a1a',
      bgColor2: '#1c0f2a',
      bgColor3: '#160c20',
      bgGradient: 'linear-gradient(135deg, #120a1a 0%, #1f1030 50%, #2a1540 100%)',
      navGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.85) 0%, rgba(109, 40, 217, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #120a1a 0%, #1f1030 100%)',
      sectionGradient2: 'linear-gradient(180deg, #1c0f2a 0%, #2a1540 100%)'
    },
    {
      name: '珊瑚橘',
      primary: '#FB7185',
      primaryLight: '#FDA4AF',
      primaryRgb: '251, 113, 133',
      secondary: '#F43F5E',
      secondaryRgb: '244, 63, 94',
      accent: '#FECDD3',
      accentRgb: '254, 205, 211',
      gradient: 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)',
      glowColor1: '#FB7185',
      glowColor2: '#FDA4AF',
      glowColor3: '#FECDD3',
      bgColor1: '#1a0e10',
      bgColor2: '#2a1418',
      bgColor3: '#201014',
      bgGradient: 'linear-gradient(135deg, #1a0e10 0%, #2d1820 50%, #3a2028 100%)',
      navGradient: 'linear-gradient(135deg, rgba(251, 113, 133, 0.85) 0%, rgba(244, 63, 94, 0.85) 100%)',
      sectionGradient1: 'linear-gradient(180deg, #1a0e10 0%, #2d1820 100%)',
      sectionGradient2: 'linear-gradient(180deg, #2a1418 0%, #3a2028 100%)'
    }
  ];

  let currentThemeIndex = 0;
  
  // Sort themes by color similarity for smooth transitions (Requirements: 1.1)
  // Uses nearest neighbor algorithm to ensure adjacent themes have hue difference <= 60 degrees
  const sortedThemes = window.ColorUtils ? 
    window.ColorUtils.sortThemesByColorSimilarity(themes) : 
    themes;

  /**
   * Update navigation bar with theme colors using smooth transitions
   * Uses rgba background colors that can transition smoothly
   * @param {Object} theme - Theme configuration object
   * Requirements: 2.1, 2.2
   */
  function updateNavigationBar(theme) {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // Use rgba background color for smooth transition (gradients don't transition)
    // Transparency between 0.8-0.9 as per requirements
    header.style.backgroundColor = `rgba(${theme.primaryRgb}, 0.15)`;
    header.style.background = `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.2) 0%, rgba(${theme.secondaryRgb}, 0.15) 100%)`;
    
    // Maintain backdrop-filter blur effect for glass morphism
    header.style.backdropFilter = 'blur(20px)';
    header.style.webkitBackdropFilter = 'blur(20px)';
    
    // Update border color to match theme
    header.style.borderBottomColor = `rgba(${theme.primaryRgb}, 0.2)`;
    
    // Set CSS variable for nav gradient (used by scrolled state)
    document.documentElement.style.setProperty('--nav-gradient', theme.navGradient);
  }

  /**
   * Update glow orbs and particles with theme colors
   * Applies theme colors to glow orbs and updates particle colors from theme palette
   * Ensures synchronized transition timing (2s) with theme switching
   * @param {Object} theme - Theme configuration object
   * Requirements: 4.1, 4.2, 4.3
   */
  function updateGlowAndParticles(theme) {
    // Get the theme transition duration from CSS variable (2s)
    const transitionDuration = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-transition').trim() || '2s ease';
    
    // Update glow orb colors (Requirements: 4.1)
    const glowOrbs = document.querySelectorAll('.glow-orb');
    glowOrbs.forEach((orb, index) => {
      // Apply synchronized transition timing
      orb.style.transition = `background ${transitionDuration}`;
      
      // Apply theme glow colors based on orb index
      if (index === 0) {
        orb.style.background = theme.glowColor1;
      } else if (index === 1) {
        orb.style.background = theme.glowColor2;
      } else if (index === 2) {
        orb.style.background = theme.glowColor3;
      }
    });
    
    // Update particle colors from theme palette (Requirements: 4.2)
    const particles = document.querySelectorAll('.particle');
    const particleColors = [theme.primary, theme.secondary, theme.accent, theme.primaryLight];
    
    particles.forEach(particle => {
      // Apply synchronized transition timing
      particle.style.transition = `background ${transitionDuration}`;
      
      // Randomly assign a color from the theme palette
      const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.background = randomColor;
    });
    
    // Set CSS variables for glow colors (for any CSS-based animations)
    const root = document.documentElement;
    root.style.setProperty('--glow-color-1', theme.glowColor1);
    root.style.setProperty('--glow-color-2', theme.glowColor2);
    root.style.setProperty('--glow-color-3', theme.glowColor3);
  }

  /**
   * Update page background with theme gradients using smooth color transitions
   * Uses solid background colors that can transition smoothly instead of gradients
   * @param {Object} theme - Theme configuration object
   * Requirements: 3.1, 3.2
   */
  function updatePageBackground(theme) {
    // Set CSS variables for background colors (these transition smoothly)
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', theme.bgGradient);
    root.style.setProperty('--section-gradient-1', theme.sectionGradient1);
    root.style.setProperty('--section-gradient-2', theme.sectionGradient2);
    
    // Use solid background colors for smooth transitions
    // CSS gradients don't transition smoothly, so we use the base colors
    document.body.style.backgroundColor = theme.bgColor1;
    
    // Apply background colors to primary sections (introduction, traits)
    document.querySelectorAll('.introduction-section, .traits-section').forEach(el => {
      el.style.backgroundColor = theme.bgColor1;
    });
    
    // Apply background colors to secondary sections (hobbies, friendship, contact)
    document.querySelectorAll('.hobbies-section, .friendship-section, .contact-section').forEach(el => {
      el.style.backgroundColor = theme.bgColor2;
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    
    // 设置所有CSS变量
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-light', theme.primaryLight);
    root.style.setProperty('--color-primary-rgb', theme.primaryRgb);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-secondary-rgb', theme.secondaryRgb);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-rgb', theme.accentRgb);
    root.style.setProperty('--gradient-primary', theme.gradient);
    root.style.setProperty('--shadow-glow', `0 0 30px rgba(${theme.primaryRgb}, 0.3)`);
    root.style.setProperty('--color-background', theme.bgColor1);
    root.style.setProperty('--color-background-secondary', theme.bgColor2);
    root.style.setProperty('--bg-color-3', theme.bgColor3);
    root.style.setProperty('--glass-border', `rgba(${theme.primaryRgb}, 0.2)`);
    
    // 更新body背景 - 使用新的updatePageBackground函数
    updatePageBackground(theme);

    // 更新导航栏 - 使用新的updateNavigationBar函数
    updateNavigationBar(theme);
    
    const footer = document.querySelector('.site-footer');
    if (footer) {
      footer.style.background = `linear-gradient(180deg, ${theme.bgColor2} 0%, ${theme.bgColor3} 100%)`;
      footer.style.borderTopColor = `rgba(${theme.primaryRgb}, 0.2)`;
    }

    // 更新光晕和粒子颜色 - 使用新的updateGlowAndParticles函数
    updateGlowAndParticles(theme);

    // 更新高亮文字
    document.querySelectorAll('.highlight-tag').forEach(el => {
      el.style.color = theme.primaryLight;
    });

    // 更新标题渐变色
    document.querySelectorAll('.intro-greeting').forEach(el => {
      el.style.background = `linear-gradient(135deg, #fff 0%, ${theme.primaryLight} 50%, ${theme.accent} 100%)`;
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.backgroundClip = 'text';
    });

    // 更新section标题
    document.querySelectorAll('.section-title').forEach(el => {
      el.style.background = `linear-gradient(135deg, #fff 0%, ${theme.primaryLight} 100%)`;
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.backgroundClip = 'text';
    });

    // 更新section标题下划线
    document.querySelectorAll('.section-title::after').forEach(el => {
      el.style.background = theme.gradient;
    });

    // 更新logo
    document.querySelectorAll('.logo-link').forEach(el => {
      el.style.background = theme.gradient;
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.backgroundClip = 'text';
    });

    // 更新导航链接
    document.querySelectorAll('.nav-link.active').forEach(el => {
      el.style.backgroundColor = `rgba(${theme.primaryRgb}, 0.2)`;
    });

    // 更新所有标签
    document.querySelectorAll('.tag').forEach(el => {
      el.style.borderColor = `rgba(${theme.primaryRgb}, 0.3)`;
    });
    document.querySelectorAll('.tag-sports').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.secondaryRgb}, 0.2) 0%, rgba(${theme.secondaryRgb}, 0.1) 100%)`;
      el.style.borderColor = `rgba(${theme.secondaryRgb}, 0.3)`;
      el.style.color = theme.secondary;
    });
    document.querySelectorAll('.tag-leisure').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.2) 0%, rgba(${theme.accentRgb}, 0.1) 100%)`;
      el.style.borderColor = `rgba(${theme.accentRgb}, 0.3)`;
      el.style.color = theme.accent;
    });
    document.querySelectorAll('.tag-tech').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.2) 0%, rgba(${theme.primaryRgb}, 0.1) 100%)`;
      el.style.borderColor = `rgba(${theme.primaryRgb}, 0.3)`;
      el.style.color = theme.primaryLight;
    });
    document.querySelectorAll('.tag-friendly').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.2) 0%, rgba(${theme.accentRgb}, 0.1) 100%)`;
      el.style.borderColor = `rgba(${theme.accentRgb}, 0.3)`;
      el.style.color = theme.accent;
    });

    // 更新所有卡片
    document.querySelectorAll('.hobby-card, .trait-card, .friend-type-card, .contact-card, .criteria-item, .contact-form-wrapper, .friendship-cta').forEach(el => {
      el.style.borderColor = `rgba(${theme.primaryRgb}, 0.15)`;
    });

    // 更新卡片图标
    document.querySelectorAll('.hobby-card-icon').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.secondaryRgb}, 0.3) 0%, rgba(${theme.secondaryRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 30px rgba(${theme.secondaryRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-sports').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.secondaryRgb}, 0.3) 0%, rgba(${theme.secondaryRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 30px rgba(${theme.secondaryRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-leisure').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.3) 0%, rgba(${theme.accentRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 30px rgba(${theme.accentRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-tech, .icon-tech-partner').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.3) 0%, rgba(${theme.primaryRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 30px rgba(${theme.primaryRgb}, 0.3)`;
    });

    // 更新特质图标
    document.querySelectorAll('.icon-friendly').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.3) 0%, rgba(${theme.accentRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 40px rgba(${theme.accentRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-patient, .icon-play-partner').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.secondaryRgb}, 0.3) 0%, rgba(${theme.secondaryRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 40px rgba(${theme.secondaryRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-caring').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.3) 0%, rgba(${theme.accentRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 40px rgba(${theme.accentRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-curious').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.secondaryRgb}, 0.3) 0%, rgba(${theme.secondaryRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 40px rgba(${theme.secondaryRgb}, 0.3)`;
    });

    // 更新联系卡片图标
    document.querySelectorAll('.icon-wechat').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.secondaryRgb}, 0.3) 0%, rgba(${theme.secondaryRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 30px rgba(${theme.secondaryRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-github').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.3) 0%, rgba(${theme.primaryRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 30px rgba(${theme.primaryRgb}, 0.3)`;
    });
    document.querySelectorAll('.icon-email').forEach(el => {
      el.style.background = `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.3) 0%, rgba(${theme.accentRgb}, 0.1) 100%)`;
      el.style.boxShadow = `0 0 30px rgba(${theme.accentRgb}, 0.3)`;
    });

    // 更新所有按钮
    document.querySelectorAll('.cta-button, .form-submit, .modal-btn-primary').forEach(el => {
      el.style.background = theme.gradient;
    });

    // 更新聊天按钮
    const chatBtn = document.querySelector('.intro-chat-btn');
    if (chatBtn) {
      // 更新伪元素需要通过CSS变量
      chatBtn.style.setProperty('--btn-gradient', theme.gradient);
    }

    // 更新页脚标题
    document.querySelectorAll('.footer-title').forEach(el => {
      el.style.background = theme.gradient;
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.backgroundClip = 'text';
    });

    // 更新联系卡片
    document.querySelectorAll('.contact-card-hint').forEach(el => {
      el.style.color = theme.primaryLight;
    });
    document.querySelectorAll('.contact-card-value').forEach(el => {
      el.style.color = theme.primaryLight;
    });

    // 更新社交链接
    document.querySelectorAll('.social-link').forEach(el => {
      el.style.borderColor = `rgba(${theme.primaryRgb}, 0.2)`;
    });

    // 更新表单输入框
    document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
      el.style.borderColor = `rgba(${theme.primaryRgb}, 0.2)`;
    });

    // 更新滚动条颜色（通过CSS变量）
    root.style.setProperty('--scrollbar-color', theme.primary);

    // 更新hobby-item hover背景
    document.querySelectorAll('.hobby-item').forEach(el => {
      el.dataset.hoverBg = `rgba(${theme.primaryRgb}, 0.1)`;
    });

    // 更新criteria图标动画颜色
    document.querySelectorAll('.criteria-icon').forEach(el => {
      el.style.filter = `drop-shadow(0 0 10px rgba(${theme.primaryRgb}, 0.3))`;
    });
  }

  function switchTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % sortedThemes.length;
    applyTheme(sortedThemes[currentThemeIndex]);
  }

  // 初始应用第一个主题（使用排序后的主题队列）
  applyTheme(sortedThemes[0]);

  // 每3秒切换一次主题（2秒渐变 + 1秒停留）
  // Requirements: 1.2 (2s transition), 1.3 (1s minimum hold time)
  setInterval(switchTheme, 3000);
}
