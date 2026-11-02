/**
 * ========================================================
 * APLICAÇÃO: MENU PRINCIPAL ESTILO ROBLOX (CLIENT / APP HUB)
 * Projetado para Ultimate UI (Minecraft) e xqedii.dev/ultimateui/editor
 * Sem marcas registradas, títulos fixos ou logotipos protegidos
 * ========================================================
 */

class RobloxMainMenuApp {
  constructor() {
    this.currentView = 'view-home';
    this.activeStudioTab = 'tab-skin';
    this.soundEnabled = true;
    this.audioCtx = null;
    this.searchQuery = '';
    this.selectedCategory = 'all';

    // Estado do Avatar
    this.avatarState = {
      skinColor: '#E5A00D', // Classic Yellow
      torsoColor: '#0D69AC', // Classic Blue
      legColor: '#27462D',   // Classic Green
      hat: 'hair_classic',
      shirt: 'shirt_casual',
      accessory: 'none',
      rotation: 0,
      isDragging: false,
      lastMouseX: 0,
      activeEmote: null,
      emoteFrame: 0
    };

    // Amigos Online Simulados
    this.friendsList = [
      { name: 'Alex_Master', icon: '🤠', status: 'online', game: 'BedWars 4v4', color: '#D97706' },
      { name: 'Steve_Gamer', icon: '⚔️', status: 'online', game: 'Sobrevivência RPG', color: '#2563EB' },
      { name: 'PixelHero', icon: '🛡️', status: 'online', game: 'SkyWars Solo', color: '#059669' },
      { name: 'DiamondKnight', icon: '👑', status: 'online', game: 'Murder Mystery', color: '#7C3AED' },
      { name: 'BlockBuilder99', icon: '🧱', status: 'online', game: 'Construção Criativa', color: '#DB2777' },
      { name: 'ShadowMiner', icon: '⛏️', status: 'online', game: 'RankUP Miner', color: '#4B5563' },
      { name: 'CraftyNinja', icon: '🥷', status: 'online', game: 'Parkour Infinito', color: '#111827' },
      { name: 'GoldenApple', icon: '🍏', status: 'online', game: 'Arena PvP', color: '#F59E0B' }
    ];

    // Jogos / Experiências do Catálogo
    this.gamesList = [
      {
        id: 'survival_rpg',
        title: 'Sobrevivência RPG: Reinos',
        category: 'survival',
        icon: '🌲',
        artBg: 'linear-gradient(135deg, #065F46, #047857)',
        rating: '96%',
        players: '1.4K',
        description: 'Explore masmorras perigosas, colete relíquias e evolua seu personagem.'
      },
      {
        id: 'bedwars_4v4',
        title: 'BedWars 4v4: Batalha Celeste',
        category: 'pvp',
        icon: '🛏️',
        artBg: 'linear-gradient(135deg, #B91C1C, #991B1B)',
        rating: '94%',
        players: '2.8K',
        description: 'Defenda sua cama com blocos e vença as ilhas rivais com seu esquadrão.'
      },
      {
        id: 'skywars_solo',
        title: 'SkyWars Solo: Ilhas Flutuantes',
        category: 'pvp',
        icon: '⚔️',
        artBg: 'linear-gradient(135deg, #1E40AF, #1D4ED8)',
        rating: '92%',
        players: '890',
        description: 'Batalha royale no céu. Abra baús rápidos e seja o último sobrevivente.'
      },
      {
        id: 'murder_mystery',
        title: 'Murder Mystery: Mansão Sombria',
        category: 'pvp',
        icon: '🔪',
        artBg: 'linear-gradient(135deg, #581C87, #6B21A8)',
        rating: '95%',
        players: '1.1K',
        description: 'Inocentes tentam sobreviver enquanto o Detetive caça o Assassino oculto.'
      },
      {
        id: 'rankup_classic',
        title: 'RankUP Clássico: Economia',
        category: 'rpg',
        icon: '⛏️',
        artBg: 'linear-gradient(135deg, #92400E, #B45309)',
        rating: '91%',
        players: '650',
        description: 'Minere minérios raros, venda na bolsa de valores e desbloqueie patentes.'
      },
      {
        id: 'parkour_tower',
        title: 'Torre de Parkour Infinita',
        category: 'survival',
        icon: '🏃',
        artBg: 'linear-gradient(135deg, #0F766E, #14B8A6)',
        rating: '89%',
        players: '420',
        description: 'Suba centenas de andares sem cair. Chegue ao topo e ganhe troféus.'
      }
    ];

    // Códigos do Projeto para xqedii.dev e Ultimate UI
    this.projectFiles = {};

    this.init();
  }

  init() {
    this.initAudio();
    this.renderFriends();
    this.renderContinueGames();
    this.renderRecommendedGames();
    this.renderAllGames();
    this.renderMarketItems();
    this.initAvatarStudio();
    this.bindEvents();
    this.loadProjectFiles();
    this.startEmoteLoop();
  }

  /* ========================================================
     SISTEMA DE ÁUDIO WEB SYNTH
     ======================================================== */
  initAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) this.audioCtx = new AudioCtx();
  }

  playSound(type = 'click') {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'equip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.06);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'launch') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  /* ========================================================
     NAVEGAÇÃO POR TELAS (SPA)
     ======================================================== */
  switchView(viewId) {
    this.currentView = viewId;

    // Atualiza links superiores
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Atualiza sidebar
    document.querySelectorAll('.sidebar-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Alterna visibilidade dos painéis
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === viewId);
    });

    this.playSound('click');

    if (viewId === 'view-avatar') {
      setTimeout(() => this.drawStudioAvatar(), 40);
    }
  }

  /* ========================================================
     RENDERIZADOR DE AMIGOS E JOGOS
     ======================================================== */
  renderFriends() {
    const container = document.getElementById('friends-carousel');
    if (!container) return;

    container.innerHTML = '';
    this.friendsList.forEach(friend => {
      const card = document.createElement('div');
      card.className = 'friend-bubble-card';
      card.innerHTML = `
        <div class="friend-avatar-wrap">
          <span>${friend.icon}</span>
          <span class="friend-status-dot"></span>
        </div>
        <span class="friend-name">${friend.name}</span>
        <span class="friend-playing-tag">${friend.game}</span>
      `;
      card.addEventListener('click', () => {
        this.playSound('pop');
        this.showToast(`${friend.name} está jogando ${friend.game}!`);
      });
      container.appendChild(card);
    });
  }

  renderContinueGames() {
    const container = document.getElementById('continue-games-list');
    if (!container) return;

    container.innerHTML = '';
    const recents = this.gamesList.slice(0, 3);
    recents.forEach(game => {
      const card = this.createGameCard(game);
      container.appendChild(card);
    });
  }

  renderRecommendedGames() {
    const container = document.getElementById('recommended-games-grid');
    if (!container) return;

    container.innerHTML = '';
    const filtered = this.gamesList.filter(g => {
      const matchCat = this.selectedCategory === 'all' || g.category === this.selectedCategory;
      const matchSearch = !this.searchQuery || g.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; padding: 24px; color: #9CA3AF; text-align: center;">Nenhuma experiência encontrada com este filtro.</div>';
      return;
    }

    filtered.forEach(game => {
      container.appendChild(this.createGameCard(game));
    });
  }

  renderAllGames() {
    const container = document.getElementById('all-games-grid');
    if (!container) return;

    container.innerHTML = '';
    this.gamesList.forEach(game => {
      container.appendChild(this.createGameCard(game));
    });
  }

  createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card-roblox';
    card.innerHTML = `
      <div class="game-art-banner" style="background: ${game.artBg};">
        <span>${game.icon}</span>
        <button class="game-play-overlay-btn" title="Jogar Agora">
          <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="game-card-info">
        <h4 class="game-title" title="${game.title}">${game.title}</h4>
        <div class="game-stats-row">
          <span class="game-rating">👍 ${game.rating}</span>
          <span class="game-players">👥 ${game.players}</span>
        </div>
      </div>
    `;

    // Clicar em qualquer parte do card ou no botão play dispara o jogo
    card.addEventListener('click', () => {
      this.launchGame(game);
    });

    return card;
  }

  renderMarketItems() {
    const container = document.getElementById('market-items-grid');
    if (!container) return;

    const items = [
      { name: 'Asas Flamejantes', price: '450 $', icon: '🪽', bg: '#7C2D12' },
      { name: 'Coroa Imperial', price: '800 $', icon: '👑', bg: '#78350F' },
      { name: 'Armadura Fantasma', price: '600 $', icon: '🛡️', bg: '#1E3A8A' },
      { name: 'Espada de Raios', price: '350 $', icon: '⚡', bg: '#065F46' },
      { name: 'Capa da Sombra', price: '250 $', icon: '🧣', bg: '#312E81' },
      { name: 'Elmo Cibernético', price: '500 $', icon: '⛑️', bg: '#831843' }
    ];

    container.innerHTML = '';
    items.forEach(it => {
      const card = document.createElement('div');
      card.className = 'game-card-roblox';
      card.innerHTML = `
        <div class="game-art-banner" style="background: ${it.bg};">
          <span>${it.icon}</span>
        </div>
        <div class="game-card-info">
          <h4 class="game-title">${it.name}</h4>
          <div class="game-stats-row">
            <span style="color:var(--roblox-gold); font-weight:700;">${it.price}</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        this.playSound('equip');
        this.showToast(`${it.name} adquirido e enviado ao seu inventário!`);
      });
      container.appendChild(card);
    });
  }

  /* ========================================================
     SIMULADOR DE INICIALIZAÇÃO DE EXPERIÊNCIA
     ======================================================== */
  launchGame(game) {
    const modal = document.getElementById('modal-launch');
    const art = document.getElementById('launch-art-box');
    const title = document.getElementById('launch-title');
    const desc = document.getElementById('launch-desc');
    const fill = document.getElementById('launch-progress');

    if (!modal) return;

    art.style.background = game.artBg;
    art.innerText = game.icon;
    title.innerText = `Iniciando: ${game.title}`;
    desc.innerText = 'Carregando pacotes de recursos e conectando ao servidor...';
    fill.style.width = '0%';

    modal.classList.add('open');
    this.playSound('launch');

    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      fill.style.width = `${prog}%`;
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          modal.classList.remove('open');
          this.showToast(`Conectado com sucesso a: ${game.title}!`);
        }, 500);
      }
    }, 280);

    document.getElementById('btn-cancel-launch').onclick = () => {
      clearInterval(interval);
      modal.classList.remove('open');
      this.playSound('click');
    };
  }

  /* ========================================================
     AVATAR STUDIO (CANVAS 3D ROTATÓRIO COM PALETA)
     ======================================================== */
  initAvatarStudio() {
    const canvas = document.getElementById('studio-avatar-canvas');
    if (!canvas) return;

    // 1. Gerar Paleta de Cores estilo Roblox
    const swatchesGrid = document.getElementById('skin-color-swatches');
    const colors = [
      '#E5A00D', // Classic Yellow
      '#E8B88A', // Tan
      '#D29C6E', // Medium Tan
      '#A56A44', // Brown
      '#5C3A21', // Dark Brown
      '#0D69AC', // Bright Blue
      '#C4281C', // Bright Red
      '#27462D', // Earth Green
      '#6B327C', // Purple
      '#F2F3F3', // White
      '#635F62', // Medium Stone
      '#1B2A35'  // Black
    ];

    if (swatchesGrid) {
      swatchesGrid.innerHTML = '';
      colors.forEach(col => {
        const swatch = document.createElement('div');
        swatch.className = `studio-swatch ${col === this.avatarState.skinColor ? 'active' : ''}`;
        swatch.style.backgroundColor = col;

        swatch.addEventListener('click', () => {
          document.querySelectorAll('.studio-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          this.avatarState.skinColor = col;
          this.playSound('equip');
          this.drawStudioAvatar();
          this.updateTopAvatarColor();
        });

        swatchesGrid.appendChild(swatch);
      });
    }

    // 2. Gerar Roupas
    const clothesGrid = document.getElementById('studio-clothes-grid');
    const clothesList = [
      { id: 'shirt_casual', name: 'Casual Azul', icon: '👕', torso: '#0D69AC', legs: '#1B2A35' },
      { id: 'shirt_suit', name: 'Terno Executivo', icon: '👔', torso: '#1B2A35', legs: '#1B2A35' },
      { id: 'shirt_hoodie', name: 'Moletom Vermelho', icon: '🧥', torso: '#C4281C', legs: '#23272F' },
      { id: 'shirt_armor', name: 'Armadura Diamante', icon: '🛡️', torso: '#38BDF8', legs: '#0284C7' },
      { id: 'shirt_ninja', name: 'Manto das Sombras', icon: '🥷', torso: '#18181B', legs: '#18181B' },
      { id: 'shirt_gold', name: 'Armadura Dourada', icon: '✨', torso: '#F59E0B', legs: '#D97706' }
    ];

    if (clothesGrid) {
      clothesGrid.innerHTML = '';
      clothesList.forEach(it => {
        const card = document.createElement('div');
        card.className = `studio-item-card ${it.id === this.avatarState.shirt ? 'active' : ''}`;
        card.innerHTML = `
          <span class="studio-equipped-tag">EQUIPADO</span>
          <span class="studio-item-icon">${it.icon}</span>
          <span class="studio-item-name">${it.name}</span>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('#studio-clothes-grid .studio-item-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.avatarState.shirt = it.id;
          this.avatarState.torsoColor = it.torso;
          this.avatarState.legColor = it.legs;
          this.playSound('equip');
          this.drawStudioAvatar();
        });
        clothesGrid.appendChild(card);
      });
    }

    // 3. Gerar Chapéus & Cabelos
    const hatsGrid = document.getElementById('studio-hats-grid');
    const hatsList = [
      { id: 'none', name: 'Nenhum', icon: '❌' },
      { id: 'hair_classic', name: 'Cabelo Clássico', icon: '💇' },
      { id: 'hat_cap', name: 'Boné Vermelho', icon: '🧢' },
      { id: 'hat_crown', name: 'Coroa Imperial', icon: '👑' },
      { id: 'hat_helm', name: 'Elmo Guerreiro', icon: '⛑️' },
      { id: 'hat_wizard', name: 'Chapéu Mágico', icon: '🧙' }
    ];

    if (hatsGrid) {
      hatsGrid.innerHTML = '';
      hatsList.forEach(it => {
        const card = document.createElement('div');
        card.className = `studio-item-card ${it.id === this.avatarState.hat ? 'active' : ''}`;
        card.innerHTML = `
          <span class="studio-equipped-tag">EQUIPADO</span>
          <span class="studio-item-icon">${it.icon}</span>
          <span class="studio-item-name">${it.name}</span>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('#studio-hats-grid .studio-item-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.avatarState.hat = it.id;
          this.playSound('equip');
          this.drawStudioAvatar();
        });
        hatsGrid.appendChild(card);
      });
    }

    // 4. Gerar Acessórios de Costas
    const accGrid = document.getElementById('studio-accessories-grid');
    const accList = [
      { id: 'none', name: 'Nenhum', icon: '❌' },
      { id: 'acc_wings', name: 'Asas de Dragão', icon: '🪽' },
      { id: 'acc_cape', name: 'Capa Épica', icon: '🧣' },
      { id: 'acc_backpack', name: 'Mochila Militar', icon: '🎒' },
      { id: 'acc_sword', name: 'Espada nas Costas', icon: '🗡️' }
    ];

    if (accGrid) {
      accGrid.innerHTML = '';
      accList.forEach(it => {
        const card = document.createElement('div');
        card.className = `studio-item-card ${it.id === this.avatarState.accessory ? 'active' : ''}`;
        card.innerHTML = `
          <span class="studio-equipped-tag">EQUIPADO</span>
          <span class="studio-item-icon">${it.icon}</span>
          <span class="studio-item-name">${it.name}</span>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('#studio-accessories-grid .studio-item-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.avatarState.accessory = it.id;
          this.playSound('equip');
          this.drawStudioAvatar();
        });
        accGrid.appendChild(card);
      });
    }

    // 5. Gerar Emotes Interativos
    const emotesGrid = document.getElementById('studio-emotes-grid');
    const emotesList = [
      { id: 'wave', name: 'Acenar', desc: 'Acena para outros jogadores', icon: '👋' },
      { id: 'dance', name: 'Dançar', desc: 'Passos clássicos de dança', icon: '🕺' },
      { id: 'clap', name: 'Aplaudir', desc: 'Comemora com palmas', icon: '👏' },
      { id: 'sit', name: 'Sentar', desc: 'Descansa no chão', icon: '🪑' }
    ];

    if (emotesGrid) {
      emotesGrid.innerHTML = '';
      emotesList.forEach(em => {
        const card = document.createElement('div');
        card.className = 'studio-emote-card';
        card.innerHTML = `
          <span class="studio-emote-icon">${em.icon}</span>
          <div class="studio-emote-info">
            <span class="studio-emote-title">${em.name}</span>
            <span class="studio-emote-desc">${em.desc}</span>
          </div>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('.studio-emote-card').forEach(c => c.classList.remove('playing'));
          card.classList.add('playing');
          this.playEmote(em.id);
          this.playSound('pop');
        });
        emotesGrid.appendChild(card);
      });
    }

    // Rotação com Mouse (Drag)
    canvas.addEventListener('mousedown', (e) => {
      this.avatarState.isDragging = true;
      this.avatarState.lastMouseX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.avatarState.isDragging) {
        const delta = e.clientX - this.avatarState.lastMouseX;
        this.avatarState.rotation += delta * 0.02;
        this.avatarState.lastMouseX = e.clientX;
        this.drawStudioAvatar();
      }
    });

    window.addEventListener('mouseup', () => {
      this.avatarState.isDragging = false;
    });

    // Rotação com Touch no Celular
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        this.avatarState.isDragging = true;
        this.avatarState.lastMouseX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.avatarState.isDragging && e.touches && e.touches.length > 0) {
        const delta = e.touches[0].clientX - this.avatarState.lastMouseX;
        this.avatarState.rotation += delta * 0.025;
        this.avatarState.lastMouseX = e.touches[0].clientX;
        this.drawStudioAvatar();
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.avatarState.isDragging = false;
    });

    // Controles de giro
    document.getElementById('btn-stage-rot-left')?.addEventListener('click', () => {
      this.avatarState.rotation -= Math.PI / 4;
      this.drawStudioAvatar();
    });
    document.getElementById('btn-stage-rot-right')?.addEventListener('click', () => {
      this.avatarState.rotation += Math.PI / 4;
      this.drawStudioAvatar();
    });
    document.getElementById('btn-stage-reset')?.addEventListener('click', () => {
      this.avatarState.rotation = 0;
      this.drawStudioAvatar();
    });

    // Reset e Salvar
    document.getElementById('btn-studio-reset')?.addEventListener('click', () => {
      this.avatarState.skinColor = '#E5A00D';
      this.avatarState.torsoColor = '#0D69AC';
      this.avatarState.legColor = '#27462D';
      this.avatarState.hat = 'hair_classic';
      this.avatarState.shirt = 'shirt_casual';
      this.avatarState.accessory = 'none';
      this.avatarState.rotation = 0;
      this.playSound('equip');
      this.drawStudioAvatar();
      this.initAvatarStudio();
      this.showToast('Avatar restaurado ao padrão original!');
    });

    document.getElementById('btn-studio-save')?.addEventListener('click', () => {
      this.playSound('equip');
      this.showToast('Visual do Avatar salvo com sucesso!');
    });

    this.drawStudioAvatar();
  }

  updateTopAvatarColor() {
    const head = document.getElementById('top-avatar-head');
    const homeHead = document.querySelector('.greeting-avatar-circle');
    if (head) head.style.backgroundColor = this.avatarState.skinColor;
    if (homeHead) homeHead.style.backgroundColor = this.avatarState.skinColor;
  }

  playEmote(id) {
    this.avatarState.activeEmote = id;
    this.avatarState.emoteFrame = 0;

    clearTimeout(this.emoteTimeout);
    this.emoteTimeout = setTimeout(() => {
      this.avatarState.activeEmote = null;
      document.querySelectorAll('.studio-emote-card').forEach(c => c.classList.remove('playing'));
      this.drawStudioAvatar();
    }, 4500);
  }

  startEmoteLoop() {
    const loop = () => {
      if (this.avatarState.activeEmote) {
        this.avatarState.emoteFrame += 0.12;
        this.drawStudioAvatar();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* RENDERIZADOR DO AVATAR EM CANVAS */
  drawStudioAvatar() {
    const canvas = document.getElementById('studio-avatar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Sombra oval no chão
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 45, 75, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    const rot = this.avatarState.rotation;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const centerX = width / 2;
    const centerY = height / 2 - 20;

    // Animações de Emote
    let armLeftAngle = 0;
    let armRightAngle = 0;
    let bobY = 0;
    let legOffset = 0;

    if (this.avatarState.activeEmote === 'wave') {
      armRightAngle = -Math.PI / 1.3 + Math.sin(this.avatarState.emoteFrame * 4) * 0.35;
    } else if (this.avatarState.activeEmote === 'dance') {
      bobY = Math.sin(this.avatarState.emoteFrame * 3) * 10;
      armLeftAngle = Math.sin(this.avatarState.emoteFrame * 3) * 0.9;
      armRightAngle = -Math.sin(this.avatarState.emoteFrame * 3) * 0.9;
    } else if (this.avatarState.activeEmote === 'clap') {
      armLeftAngle = -Math.PI / 2.2 + Math.sin(this.avatarState.emoteFrame * 6) * 0.2;
      armRightAngle = -Math.PI / 2.2 - Math.sin(this.avatarState.emoteFrame * 6) * 0.2;
    } else if (this.avatarState.activeEmote === 'sit') {
      bobY = 45;
      legOffset = 30;
    }

    ctx.save();
    ctx.translate(centerX, centerY + bobY);

    // 1. Asas ou Capa nas Costas
    if (this.avatarState.accessory === 'acc_wings') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      // Asa esquerda
      ctx.beginPath();
      ctx.moveTo(-cosR * 35, -20);
      ctx.lineTo(-95, -100);
      ctx.lineTo(-85, -20);
      ctx.lineTo(-cosR * 25, 25);
      ctx.fill();
      // Asa direita
      ctx.beginPath();
      ctx.moveTo(cosR * 35, -20);
      ctx.lineTo(95, -100);
      ctx.lineTo(85, -20);
      ctx.lineTo(cosR * 25, 25);
      ctx.fill();
    } else if (this.avatarState.accessory === 'acc_cape') {
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(-34 * cosR - 26, -15, 52, 100);
    }

    // 2. Pernas (Blocky Legs)
    ctx.fillStyle = this.avatarState.legColor;
    ctx.fillRect(-32 * cosR - 22, 60 - legOffset, 20, 68 + legOffset);
    ctx.fillRect(32 * cosR + 2, 60 - legOffset, 20, 68 + legOffset);

    // Sapatos
    ctx.fillStyle = '#111317';
    ctx.fillRect(-32 * cosR - 22, 115, 20, 15);
    ctx.fillRect(32 * cosR + 2, 115, 20, 15);

    // 3. Tronco (Blocky Torso)
    ctx.fillStyle = this.avatarState.torsoColor;
    const torsoW = 54 * Math.max(0.4, Math.abs(cosR));
    ctx.fillRect(-torsoW / 2, -20, torsoW, 80);

    // Detalhe de cinto
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-torsoW / 2, 48, torsoW, 12);

    // 4. Braço Esquerdo
    ctx.save();
    ctx.translate(-torsoW / 2 - 10, -15);
    ctx.rotate(armLeftAngle);
    ctx.fillStyle = this.avatarState.skinColor;
    ctx.fillRect(-10, 0, 18, 68);
    ctx.fillStyle = this.avatarState.torsoColor;
    ctx.fillRect(-10, 0, 18, 24); // Manga
    ctx.restore();

    // 5. Braço Direito
    ctx.save();
    ctx.translate(torsoW / 2 + 10, -15);
    ctx.rotate(armRightAngle);
    ctx.fillStyle = this.avatarState.skinColor;
    ctx.fillRect(-8, 0, 18, 68);
    ctx.fillStyle = this.avatarState.torsoColor;
    ctx.fillRect(-8, 0, 18, 24); // Manga
    ctx.restore();

    // 6. Cabeça (Blocky Head)
    ctx.fillStyle = this.avatarState.skinColor;
    const headSize = 56;
    ctx.fillRect(-headSize / 2, -headSize - 20, headSize, headSize);

    // Olhos e Sorriso clássico
    if (cosR >= -0.2) {
      const faceShiftX = sinR * 14;
      ctx.fillStyle = '#111827';
      ctx.fillRect(-16 + faceShiftX, -56, 8, 10);
      ctx.fillRect(10 + faceShiftX, -56, 8, 10);
      ctx.fillRect(-12 + faceShiftX, -38, 24, 5);
    }

    // 7. Chapéu / Cabelo
    if (this.avatarState.hat === 'hair_classic') {
      ctx.fillStyle = '#451A03';
      ctx.fillRect(-headSize / 2 - 2, -headSize - 24, headSize + 4, 18);
      ctx.fillRect(-headSize / 2 - 5, -headSize - 24, 10, 28);
    } else if (this.avatarState.hat === 'hat_cap') {
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-headSize / 2 - 2, -headSize - 26, headSize + 4, 20);
      ctx.fillRect(-headSize / 2 - 16, -headSize - 10, 28, 8); // Aba
    } else if (this.avatarState.hat === 'hat_crown') {
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(-headSize / 2, -headSize - 32, headSize, 16);
      ctx.beginPath();
      ctx.moveTo(-headSize / 2, -headSize - 32);
      ctx.lineTo(-headSize / 2 + 10, -headSize - 45);
      ctx.lineTo(-headSize / 2 + 20, -headSize - 32);
      ctx.lineTo(0, -headSize - 48);
      ctx.lineTo(headSize / 2 - 20, -headSize - 32);
      ctx.lineTo(headSize / 2 - 10, -headSize - 45);
      ctx.lineTo(headSize / 2, -headSize - 32);
      ctx.fill();
    } else if (this.avatarState.hat === 'hat_helm') {
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-headSize / 2 - 4, -headSize - 26, headSize + 8, 40);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-headSize / 2 + 8, -headSize - 8, headSize - 16, 12);
    }

    ctx.restore();
  }

  /* ========================================================
     MODAL DE EXPORTAÇÃO PARA ULTIMATE UI / XQEDII.DEV
     ======================================================== */
  async loadProjectFiles() {
    this.projectFiles['roblox_menu_project.json'] = `{
  "project": "Roblox_Main_Menu_UltimateUI",
  "version": "1.0.0",
  "target": "xqedii.dev/ultimateui/editor",
  "canvas": { "width": 1280, "height": 720, "background": "#0F1115" },
  "components": [
    { "type": "panel", "id": "top_bar", "x": 0, "y": 0, "w": 1280, "h": 56, "bg": "#181A20" },
    { "type": "button", "id": "btn_home", "x": 80, "y": 12, "text": "Início" },
    { "type": "button", "id": "btn_avatar", "x": 280, "y": 12, "text": "Avatar" },
    { "type": "character_view_3d", "id": "avatar_preview", "x": 100, "y": 100, "w": 380, "h": 500 }
  ]
}`;

    try {
      const mainYmlRes = await fetch('ultimate_ui_configs/roblox_main_menu.yml');
      if (mainYmlRes.ok) this.projectFiles['roblox_main_menu.yml'] = await mainYmlRes.text();

      const avYmlRes = await fetch('ultimate_ui_configs/roblox_avatar_menu.yml');
      if (avYmlRes.ok) this.projectFiles['roblox_avatar_menu.yml'] = await avYmlRes.text();

      const res = await fetch('ultimate_ui_configs/roblox_menu_project.json');
      if (res.ok) this.projectFiles['roblox_menu_project.json'] = await res.text();

      const ymlRes = await fetch('ultimate_ui_configs/home_menu.yml');
      if (ymlRes.ok) this.projectFiles['home_menu.yml'] = await ymlRes.text();

      const avRes = await fetch('ultimate_ui_configs/avatar_menu.yml');
      if (avRes.ok) this.projectFiles['avatar_menu.yml'] = await avRes.text();

      const hudRes = await fetch('ultimate_ui_configs/hud.yml');
      if (hudRes.ok) this.projectFiles['hud.yml'] = await hudRes.text();
    } catch (e) {
      console.warn('Carregamento local:', e);
    }
  }

  showFileInModal(filename) {
    const codeArea = document.getElementById('code-display-area');
    const downloadBtn = document.getElementById('btn-download-file');
    if (!codeArea) return;

    const content = this.projectFiles[filename] || '# Arquivo ' + filename;
    codeArea.innerText = content;

    if (downloadBtn) {
      downloadBtn.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
      downloadBtn.setAttribute('download', filename);
    }

    document.querySelectorAll('.f-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.file === filename);
    });
  }

  openExportModal() {
    const modal = document.getElementById('modal-xqedii');
    if (!modal) return;
    modal.classList.add('open');
    this.showFileInModal('roblox_menu_project.json');
    this.playSound('click');
  }

  closeExportModal() {
    const modal = document.getElementById('modal-xqedii');
    if (modal) {
      modal.classList.remove('open');
      this.playSound('click');
    }
  }

  saveSettings() {
    const nameInput = document.getElementById('setting-display-name');
    if (nameInput && nameInput.value) {
      const newName = nameInput.value.trim();
      document.getElementById('player-name-text').innerText = newName;
      document.querySelector('.user-display-name').innerText = newName;
      this.showToast('Configurações salvas!');
      this.playSound('equip');
    }
  }

  showToast(message) {
    const toast = document.getElementById('toast-notify');
    const text = document.getElementById('toast-text');
    if (!toast || !text) return;

    text.innerText = message;
    toast.classList.add('show');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  /* ========================================================
     EVENT LISTENERS & BINDINGS
     ======================================================== */
  bindEvents() {
    // 1. Alternar Sidebar
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => {
      document.getElementById('main-sidebar')?.classList.toggle('collapsed');
      this.playSound('click');
    });

    // 2. Links Superiores e Sidebar (Navegação SPA)
    document.querySelectorAll('.nav-link-btn, .sidebar-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const viewId = btn.dataset.view;
        if (viewId) this.switchView(viewId);
      });
    });

    document.getElementById('btn-goto-avatar')?.addEventListener('click', () => {
      this.switchView('view-avatar');
    });

    // 3. Barra de Pesquisa em Tempo Real
    const searchInput = document.getElementById('global-search-input');
    const clearBtn = document.getElementById('btn-clear-search');

    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim();
      if (clearBtn) clearBtn.style.display = this.searchQuery ? 'block' : 'none';
      this.renderRecommendedGames();
    });

    clearBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      this.searchQuery = '';
      clearBtn.style.display = 'none';
      this.renderRecommendedGames();
    });

    // 4. Filtro de Categorias na Home
    document.querySelectorAll('#home-filter-tags .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#home-filter-tags .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.selectedCategory = pill.dataset.filter;
        this.renderRecommendedGames();
        this.playSound('click');
      });
    });

    // 5. Abas do Studio de Avatar
    document.querySelectorAll('.studio-tabs .studio-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.studio-tabs .studio-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.subtab;
        document.querySelectorAll('.studio-tab-content .studio-pane').forEach(p => {
          p.classList.toggle('active', p.id === target.replace('tab-', 'pane-'));
        });
        this.playSound('click');
      });
    });

    // Copiar YAML direto pelo botão no banner
    document.getElementById('btn-copy-main-yaml')?.addEventListener('click', () => {
      const code = this.projectFiles['roblox_main_menu.yml'];
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          this.showToast('roblox_main_menu.yml copiado com sucesso!');
          this.playSound('pop');
        });
      }
    });

    // 6. Botão de Exportar para xqedii.dev
    document.getElementById('btn-open-xqedii-export')?.addEventListener('click', () => {
      this.openExportModal();
    });

    document.getElementById('btn-close-xqedii')?.addEventListener('click', () => {
      this.closeExportModal();
    });

    document.querySelectorAll('.f-tab').forEach(t => {
      t.addEventListener('click', () => {
        this.showFileInModal(t.dataset.file);
        this.playSound('click');
      });
    });

    document.getElementById('btn-copy-code')?.addEventListener('click', () => {
      const code = document.getElementById('code-display-area')?.innerText;
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          this.showToast('Código do projeto copiado para a área de transferência!');
          this.playSound('pop');
        });
      }
    });

    // 7. Notificações e Configurações Rápidas
    document.getElementById('btn-notifications')?.addEventListener('click', () => {
      this.showToast('Você tem 3 novos convites de amigos pendentes!');
      this.playSound('pop');
    });

    document.getElementById('btn-quick-settings')?.addEventListener('click', () => {
      this.switchView('view-settings');
    });

    document.getElementById('btn-profile-dropdown')?.addEventListener('click', () => {
      this.switchView('view-avatar');
    });
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  window.app = new RobloxMainMenuApp();
});
