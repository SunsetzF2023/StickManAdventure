// 游戏核心类
class StickManAdventure {
    constructor() {
        // 初始化存档系统
        this.saveSystem = new SaveSystem();
        this.equipmentSystem = new EquipmentSystem();
        this.upgradeSystem = new UpgradeSystem();
        
        // 加载存档数据
        this.saveData = this.saveSystem.loadSave();
        
        // 计算总属性（基础属性 + 装备属性）
        const equipmentStats = this.equipmentSystem.calculateEquipmentStats(this.saveData.equipment);
        const totalStats = this.calculateTotalStats(this.saveData.baseStats, equipmentStats);
        
        this.player = {
            health: totalStats.maxHealth,
            maxHealth: totalStats.maxHealth,
            attack: totalStats.attack,
            attackSpeed: 1,
            defense: totalStats.defense,
            level: 1,
            experience: 0,
            eventsSurvived: 0,
            accuracy: totalStats.accuracy,
            luck: totalStats.luck
        };
        
        this.currentEnemy = null;
        this.inBattle = false;
        this.gameOver = false;
        this.eventCounter = 0;
        this.nextBattleIn = this.getRandomBattleInterval();
        this.walkingFrame = 0;
        this.walkingAnimation = null;
        this.battleSpeed = 1; // 战斗速度倍数
        this.autoBattleInterval = null;
        
        // 武器动画相关
        this.attackAnimation = null;
        this.attackFrame = 0;
        this.isAttacking = false;
        
        // 初始化战斗引擎
        this.battleEngine = new BattleEngine();
        
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
        this.drawCharacter();
        this.startWalkingAnimation();
    }
    
    calculateTotalStats(baseStats, equipmentStats) {
        return {
            maxHealth: baseStats.maxHealth + equipmentStats.maxHealth,
            attack: baseStats.attack + equipmentStats.attack,
            defense: baseStats.defense + equipmentStats.defense,
            accuracy: Math.min(1, baseStats.accuracy + equipmentStats.accuracy),
            luck: baseStats.luck + equipmentStats.luck
        };
    }
    
    initializeElements() {
        // 获取DOM元素
        this.elements = {
            // 屏幕
            mainScreen: document.getElementById('mainScreen'),
            battleScreen: document.getElementById('battleScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            
            // 主界面元素
            health: document.getElementById('health'),
            attack: document.getElementById('attack'),
            attackSpeed: document.getElementById('attackSpeed'),
            defense: document.getElementById('defense'),
            accuracy: document.getElementById('accuracy'),
            luck: document.getElementById('luck'),
            gold: document.getElementById('gold'),
            eventText: document.getElementById('eventText'),
            eventChoices: document.getElementById('eventChoices'),
            startBtn: document.getElementById('startBtn'),
            continueBtn: document.getElementById('continueBtn'),
            
            // 战斗界面元素
            playerCanvas: document.getElementById('playerCanvas'),
            enemyCanvas: document.getElementById('enemyCanvas'),
            playerHealth: document.getElementById('playerHealth'),
            enemyHealth: document.getElementById('enemyHealth'),
            playerStats: document.getElementById('playerStats'),
            enemyStats: document.getElementById('enemyStats'),
            battleLog: document.getElementById('battleLog'),
            speedBtn: document.getElementById('speedBtn'),
            skipBtn: document.getElementById('skipBtn'),
            
            // 游戏结束界面元素
            gameOverTitle: document.getElementById('gameOverTitle'),
            gameOverMessage: document.getElementById('gameOverMessage'),
            finalStats: document.getElementById('finalStats'),
            restartBtn: document.getElementById('restartBtn'),
            
            // 画布
            characterCanvas: document.getElementById('characterCanvas')
        };
        
        // 获取画布上下文
        this.characterCtx = this.elements.characterCanvas.getContext('2d');
        this.playerCtx = this.elements.playerCanvas.getContext('2d');
        this.enemyCtx = this.elements.enemyCanvas.getContext('2d');
    }
    
    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.continueBtn.addEventListener('click', () => this.continueAdventure());
        this.elements.speedBtn.addEventListener('click', () => this.toggleBattleSpeed());
        this.elements.skipBtn.addEventListener('click', () => this.skipBattle());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    startGame() {
        this.elements.startBtn.style.display = 'none';
        this.generateRandomEvent();
    }
    
    continueAdventure() {
        this.elements.continueBtn.style.display = 'none';
        this.eventCounter++;
        
        // 检查是否应该触发战斗
        if (this.eventCounter >= this.nextBattleIn) {
            this.startBattle();
        } else {
            this.generateRandomEvent();
        }
    }
    
    getRandomBattleInterval() {
        // 随机3-7个事件后触发战斗
        return Math.floor(Math.random() * 5) + 3;
    }
    
    generateRandomEvent() {
        const events = [
            {
                text: "你发现了一个神秘的宝箱，里面似乎有什么东西在发光...",
                choices: [
                    { text: "打开宝箱", effect: () => this.openTreasure() },
                    { text: "小心地绕过去", effect: () => this.avoidTreasure() }
                ]
            },
            {
                text: "一个商人向你推销奇怪的药水...",
                choices: [
                    { text: "购买红色药水（+20生命）", effect: () => this.buyHealthPotion() },
                    { text: "购买蓝色药水（+1攻击力）", effect: () => this.buyAttackPotion() },
                    { text: "礼貌地拒绝", effect: () => this.refuseMerchant() }
                ]
            },
            {
                text: "你遇到了一个受伤的旅行者，他请求你的帮助...",
                choices: [
                    { text: "帮助他（可能获得奖励）", effect: () => this.helpTraveler() },
                    { text: "无视他继续前进", effect: () => this.ignoreTraveler() }
                ]
            },
            {
                text: "前方有两条路，一条看起来很安全，另一条充满了未知的危险...",
                choices: [
                    { text: "选择安全的路", effect: () => this.chooseSafePath() },
                    { text: "选择危险的路", effect: () => this.chooseDangerousPath() }
                ]
            },
            {
                text: "你发现了一个古老的祭坛，上面刻着神秘的符文...",
                choices: [
                    { text: "触摸祭坛", effect: () => this.touchAltar() },
                    { text: "研究符文", effect: () => this.studyRunes() },
                    { text: "离开这里", effect: () => this.leaveAltar() }
                ]
            },
            {
                text: "一群野狼挡住了你的去路，它们看起来很饥饿...",
                choices: [
                    { text: "尝试吓跑它们", effect: () => this.scareWolves() },
                    { text: "投掷食物分散注意力", effect: () => this.distractWolves() },
                    { text: "悄悄绕过去", effect: () => this.sneakPastWolves() }
                ]
            },
            {
                text: "你发现了一个废弃的营地，里面有一些有用的物品...",
                choices: [
                    { text: "仔细搜索营地", effect: () => this.searchCamp() },
                    { text: "快速拿走值钱的东西", effect: () => this.quickLoot() },
                    { text: "不要碰任何东西", effect: () => this.leaveCamp() }
                ]
            },
            {
                text: "一个神秘的老人向你提出了一个谜题...",
                choices: [
                    { text: "尝试解答谜题", effect: () => this.solveRiddle() },
                    { text: "礼貌地拒绝", effect: () => this.refuseRiddle() }
                ]
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.displayEvent(event);
    }
    
    displayEvent(event) {
        this.elements.eventText.textContent = event.text;
        this.elements.eventChoices.innerHTML = '';
        
        event.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                choice.effect();
                this.elements.eventChoices.innerHTML = '';
                this.elements.continueBtn.style.display = 'block';
            });
            this.elements.eventChoices.appendChild(button);
        });
    }
    
    // 事件效果函数
    openTreasure() {
        const random = Math.random();
        if (random < 0.3) {
            this.player.health += 30;
            this.player.maxHealth += 10;
            this.showEventResult("你打开宝箱，发现了一个魔法护身符！生命值+30，最大生命值+10");
        } else if (random < 0.6) {
            this.player.attack += 2;
            this.showEventResult("宝箱里有一把锋利的匕首！攻击力+2");
        } else if (random < 0.8) {
            this.player.defense += 1;
            this.showEventResult("你发现了一件坚固的护甲！免伤+1");
        } else {
            this.player.health -= 20;
            this.showEventResult("宝箱里有陷阱！你受到了20点伤害");
        }
        this.updateUI();
    }
    
    avoidTreasure() {
        this.showEventResult("你小心地绕过了宝箱，继续前进...");
    }
    
    buyHealthPotion() {
        this.player.health = Math.min(this.player.health + 20, this.player.maxHealth);
        this.showEventResult("你喝下了红色药水，感觉好多了！生命值+20");
        this.updateUI();
    }
    
    buyAttackPotion() {
        this.player.attack += 1;
        this.showEventResult("你喝下了蓝色药水，感觉力量增强了！攻击力+1");
        this.updateUI();
    }
    
    refuseMerchant() {
        this.showEventResult("你礼貌地拒绝了商人，继续你的冒险...");
    }
    
    helpTraveler() {
        const random = Math.random();
        if (random < 0.7) {
            this.player.health += 15;
            this.player.attack += 1;
            this.showEventResult("旅行者感激地给了你一些药水和一把小刀！生命值+15，攻击力+1");
        } else {
            this.player.health -= 10;
            this.showEventResult("旅行者实际上是个强盗！你受到了10点伤害");
        }
        this.updateUI();
    }
    
    ignoreTraveler() {
        this.showEventResult("你无视了旅行者，继续前进...");
    }
    
    chooseSafePath() {
        this.player.health += 5;
        this.showEventResult("安全的路让你得到了休息，生命值+5");
        this.updateUI();
    }
    
    chooseDangerousPath() {
        const random = Math.random();
        if (random < 0.5) {
            this.player.attack += 3;
            this.player.defense += 1;
            this.showEventResult("危险的路充满了挑战，但你成长了很多！攻击力+3，免伤+1");
        } else {
            this.player.health -= 25;
            this.showEventResult("危险的路让你受伤了！生命值-25");
        }
        this.updateUI();
    }
    
    touchAltar() {
        const random = Math.random();
        if (random < 0.4) {
            this.player.maxHealth += 20;
            this.player.health = this.player.maxHealth;
            this.player.attack += 2;
            this.showEventResult("祭坛赐予你神圣的力量！最大生命值+20，攻击力+2，生命值全满");
        } else {
            this.player.health -= 15;
            this.showEventResult("祭坛的能量太强大了！你受到了15点伤害");
        }
        this.updateUI();
    }
    
    studyRunes() {
        this.player.attackSpeed += 0.5;
        this.showEventResult("你理解了符文的含义，攻击速度+0.5");
        this.updateUI();
    }
    
    leaveAltar() {
        this.showEventResult("你觉得还是不要打扰这个古老的地方...");
    }
    
    scareWolves() {
        const random = Math.random();
        if (random < 0.6) {
            this.showEventResult("你成功地吓跑了野狼！");
        } else {
            this.player.health -= 15;
            this.showEventResult("野狼没有被吓到，你受到了15点伤害");
        }
        this.updateUI();
    }
    
    distractWolves() {
        this.player.health -= 5;
        this.showEventResult("你用食物分散了野狼的注意力，但还是被咬了一口。生命值-5");
        this.updateUI();
    }
    
    sneakPastWolves() {
        this.showEventResult("你成功地悄悄绕过了野狼！");
    }
    
    searchCamp() {
        const random = Math.random();
        if (random < 0.5) {
            this.player.health += 10;
            this.player.attack += 1;
            this.showEventResult("你找到了一些补给！生命值+10，攻击力+1");
        } else {
            this.player.health -= 10;
            this.showEventResult("营地里有陷阱！你受到了10点伤害");
        }
        this.updateUI();
    }
    
    quickLoot() {
        this.player.attack += 1;
        this.showEventResult("你快速拿走了一些有用的东西，攻击力+1");
        this.updateUI();
    }
    
    leaveCamp() {
        this.showEventResult("你觉得还是不要碰别人的东西...");
    }
    
    solveRiddle() {
        const random = Math.random();
        if (random < 0.6) {
            this.player.defense += 2;
            this.player.attackSpeed += 0.5;
            this.showEventResult("老人对你的智慧很满意！免伤+2，攻击速度+0.5");
        } else {
            this.player.health -= 10;
            this.showEventResult("你答错了谜题，老人很生气！你受到了10点伤害");
        }
        this.updateUI();
    }
    
    refuseRiddle() {
        this.showEventResult("你礼貌地拒绝了老人，继续前进...");
    }
    
    showEventResult(text) {
        this.elements.eventText.textContent = text;
    }
    
    // 战斗系统
    startBattle() {
        this.inBattle = true;
        this.eventCounter = 0;
        this.nextBattleIn = this.getRandomBattleInterval();
        
        // 生成随机敌人
        const enemyTypes = [
            { name: "哥布林", health: 30, attack: 2, defense: 0, color: "#27ae60" },
            { name: "骷髅战士", health: 50, attack: 3, defense: 1, color: "#95a5a6" },
            { name: "野狼", health: 40, attack: 4, defense: 0, color: "#8b4513" },
            { name: "强盗", health: 60, attack: 3, defense: 2, color: "#8b0000" },
            { name: "暗影刺客", health: 35, attack: 5, defense: 0, color: "#2c3e50" },
            { name: "石像鬼", health: 80, attack: 2, defense: 3, color: "#696969" }
        ];
        
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.currentEnemy = {
            name: enemyType.name,
            health: enemyType.health + (this.player.level * 10),
            maxHealth: enemyType.health + (this.player.level * 10),
            attack: enemyType.attack + Math.floor(this.player.level / 2),
            defense: enemyType.defense,
            color: enemyType.color
        };
        
        this.switchToBattleScreen();
        this.updateBattleUI();
        this.drawBattleCharacters();
        this.addBattleLog(`遭遇了 ${this.currentEnemy.name}！`);
        this.addBattleLog("自动战斗开始！");
        
        // 启动自动战斗
        this.startAutoBattle();
    }
    
    switchToBattleScreen() {
        this.elements.mainScreen.classList.remove('active');
        this.elements.battleScreen.classList.add('active');
    }
    
    switchToMainScreen() {
        this.elements.battleScreen.classList.remove('active');
        this.elements.mainScreen.classList.add('active');
    }
    
    updateBattleUI() {
        // 更新玩家血条
        const playerHealthPercent = (this.player.health / this.player.maxHealth) * 100;
        this.elements.playerHealth.style.width = playerHealthPercent + '%';
        
        // 更新敌人血条
        const enemyHealthPercent = (this.currentEnemy.health / this.currentEnemy.maxHealth) * 100;
        this.elements.enemyHealth.style.width = enemyHealthPercent + '%';
        
        // 更新状态显示
        this.elements.playerStats.innerHTML = `
            生命: ${this.player.health}/${this.player.maxHealth}<br>
            攻击: ${this.player.attack}<br>
            防御: ${this.player.defense}
        `;
        
        this.elements.enemyStats.innerHTML = `
            生命: ${this.currentEnemy.health}/${this.currentEnemy.maxHealth}<br>
            攻击: ${this.currentEnemy.attack}<br>
            防御: ${this.currentEnemy.defense}
        `;
    }
    
    // 自动战斗系统
    startAutoBattle() {
        const battleInterval = 1000 / this.battleSpeed; // 根据速度调整间隔
        
        this.autoBattleInterval = setInterval(() => {
            this.performBattleRound();
        }, battleInterval);
    }
    
    performBattleRound() {
        if (!this.inBattle || this.gameOver) {
            this.stopAutoBattle();
            return;
        }
        
        // 玩家攻击
        const playerDamage = Math.max(1, this.player.attack - this.currentEnemy.defense);
        this.currentEnemy.health -= playerDamage;
        this.addBattleLog(`你对 ${this.currentEnemy.name} 造成了 ${playerDamage} 点伤害！`);
        this.animateAttack('player');
        this.drawBattleCharacters(); // 立即重绘以显示攻击动画
        
        if (this.currentEnemy.health <= 0) {
            this.stopAutoBattle();
            this.winBattle();
            return;
        }
        
        // 敌人攻击
        setTimeout(() => {
            if (!this.inBattle || this.gameOver) return;
            
            const enemyDamage = Math.max(1, this.currentEnemy.attack - this.player.defense);
            this.player.health -= enemyDamage;
            this.addBattleLog(`${this.currentEnemy.name} 对你造成了 ${enemyDamage} 点伤害！`);
            this.animateAttack('enemy');
            this.drawBattleCharacters(); // 立即重绘以显示攻击动画
            
            if (this.player.health <= 0) {
                this.stopAutoBattle();
                this.loseGame();
                return;
            }
            
            this.updateBattleUI();
        }, 200 / this.battleSpeed);
        
        this.updateBattleUI();
    }
    
    stopAutoBattle() {
        if (this.autoBattleInterval) {
            clearInterval(this.autoBattleInterval);
            this.autoBattleInterval = null;
        }
    }
    
    toggleBattleSpeed() {
        if (this.battleSpeed === 1) {
            this.battleSpeed = 2;
            this.elements.speedBtn.textContent = '2x速度';
        } else {
            this.battleSpeed = 1;
            this.elements.speedBtn.textContent = '1x速度';
        }
        
        // 如果正在战斗，重新启动自动战斗以应用新速度
        if (this.inBattle && this.autoBattleInterval) {
            this.stopAutoBattle();
            this.startAutoBattle();
        }
    }
    
    skipBattle() {
        this.stopAutoBattle();
        
        // 直接计算战斗结果
        const playerTotalDamage = this.player.attack * 10; // 假设10回合
        const enemyTotalDamage = this.currentEnemy.attack * 10;
        
        this.addBattleLog("跳过战斗，计算结果...");
        
        if (playerTotalDamage >= this.currentEnemy.health) {
            // 玩家胜利
            this.currentEnemy.health = 0;
            this.winBattle();
        } else {
            // 玩家失败
            this.player.health = 0;
            this.loseGame();
        }
    }
    
    animateAttack(attacker) {
        if (attacker === 'player') {
            // 触发玩家攻击动画
            this.isAttacking = true;
            this.attackFrame = 0;
            
            // 攻击动画持续500ms
            this.attackAnimation = setTimeout(() => {
                this.isAttacking = false;
                this.attackFrame = 0;
                this.drawBattleCharacters(); // 重绘以移除攻击效果
            }, 500 / this.battleSpeed); // 根据战斗速度调整动画时长
            
            // 添加震动效果
            this.elements.playerCanvas.classList.add('shake');
            setTimeout(() => {
                this.elements.playerCanvas.classList.remove('shake');
            }, 500);
        } else {
            // 敌人攻击动画
            this.elements.enemyCanvas.classList.add('shake');
            setTimeout(() => {
                this.elements.enemyCanvas.classList.remove('shake');
            }, 500);
        }
    }
    
    addBattleLog(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logEntry.className = 'fade-in';
        this.elements.battleLog.appendChild(logEntry);
        this.elements.battleLog.scrollTop = this.elements.battleLog.scrollHeight;
    }
    
    winBattle() {
        this.stopAutoBattle();
        this.addBattleLog(`你击败了 ${this.currentEnemy.name}！`);
        
        // 获得金币奖励（替代经验值）
        const goldGain = 10 + (this.currentEnemy.maxHealth / 2) + Math.floor(Math.random() * 20);
        this.saveData.gold += goldGain;
        this.addBattleLog(`获得 ${goldGain} 金币！`);
        
        // 随机装备掉落
        const dropChance = Math.random();
        if (dropChance < 0.3) { // 30%概率掉落装备
            const droppedItem = this.equipmentSystem.generateRandomDrop(this.player.level);
            this.saveData.inventory.push(droppedItem);
            this.addBattleLog(`获得装备：${droppedItem.name}！`);
        }
        
        // 恢复少量生命值
        const healthRestore = Math.min(20, this.player.maxHealth - this.player.health);
        if (healthRestore > 0) {
            this.player.health += healthRestore;
            this.addBattleLog(`恢复 ${healthRestore} 点生命值`);
        }
        
        // 更新统计
        this.saveData.totalWins++;
        this.saveData.enemiesDefeated++;
        this.saveData.totalGold += goldGain;
        this.player.eventsSurvived++;
        
        // 保存存档
        this.saveSystem.saveSave(this.saveData);
        
        setTimeout(() => {
            this.inBattle = false;
            this.switchToMainScreen();
            this.elements.continueBtn.style.display = 'block';
            this.elements.eventText.textContent = `战斗胜利！获得 ${goldGain} 金币。继续你的冒险...`;
            this.updateUI();
        }, 2000);
    }
    
    loseGame() {
        this.stopAutoBattle();
        this.gameOver = true;
        this.addBattleLog("你被击败了...");
        
        // 更新统计
        this.saveData.totalGames++;
        this.saveSystem.saveSave(this.saveData);
        
        setTimeout(() => {
            this.elements.battleScreen.classList.remove('active');
            this.elements.gameOverScreen.classList.add('active');
            
            this.elements.gameOverTitle.textContent = "游戏结束";
            this.elements.gameOverMessage.textContent = "你在冒险中被击败了，但你的勇气将被永远铭记。";
            
            this.elements.finalStats.innerHTML = `
                <h3>最终统计</h3>
                <div class="final-stat-item">
                    <span>等级:</span>
                    <span>${this.player.level}</span>
                </div>
                <div class="final-stat-item">
                    <span>生命值:</span>
                    <span>${this.player.health}/${this.player.maxHealth}</span>
                </div>
                <div class="final-stat-item">
                    <span>攻击力:</span>
                    <span>${this.player.attack}</span>
                </div>
                <div class="final-stat-item">
                    <span>免伤:</span>
                    <span>${this.player.defense}</span>
                </div>
                <div class="final-stat-item">
                    <span>存活事件:</span>
                    <span>${this.player.eventsSurvived}</span>
                </div>
                <div class="final-stat-item">
                    <span>获得金币:</span>
                    <span>${this.saveData.gold}</span>
                </div>
                <div class="final-stat-item">
                    <span>总胜场:</span>
                    <span>${this.saveData.totalWins}</span>
                </div>
            `;
        }, 1500);
    }
    
    restartGame() {
        // 停止自动战斗
        this.stopAutoBattle();
        
        // 重新计算属性（保持养成进度）
        const equipmentStats = this.equipmentSystem.calculateEquipmentStats(this.saveData.equipment);
        const totalStats = this.calculateTotalStats(this.saveData.baseStats, equipmentStats);
        
        this.player = {
            health: totalStats.maxHealth,
            maxHealth: totalStats.maxHealth,
            attack: totalStats.attack,
            attackSpeed: 1,
            defense: totalStats.defense,
            level: 1,
            experience: 0,
            eventsSurvived: 0,
            accuracy: totalStats.accuracy,
            luck: totalStats.luck
        };
        
        this.currentEnemy = null;
        this.inBattle = false;
        this.gameOver = false;
        this.eventCounter = 0;
        this.nextBattleIn = this.getRandomBattleInterval();
        this.battleSpeed = 1;
        this.elements.speedBtn.textContent = '1x速度';
        
        // 切换界面
        this.elements.gameOverScreen.classList.remove('active');
        this.elements.mainScreen.classList.add('active');
        
        // 重置UI
        this.elements.startBtn.style.display = 'block';
        this.elements.continueBtn.style.display = 'none';
        this.elements.eventText.textContent = "点击开始你的冒险！";
        this.elements.eventChoices.innerHTML = '';
        this.elements.battleLog.innerHTML = '';
        
        this.updateUI();
        this.drawCharacter();
    }
    
    updateUI() {
        this.elements.health.textContent = `${this.player.health}/${this.player.maxHealth}`;
        this.elements.attack.textContent = this.player.attack;
        this.elements.attackSpeed.textContent = this.player.attackSpeed;
        this.elements.defense.textContent = this.player.defense;
        this.elements.accuracy.textContent = `${Math.round(this.player.accuracy * 100)}%`;
        this.elements.luck.textContent = this.player.luck;
        this.elements.gold.textContent = this.saveData.gold;
    }
    
    drawCharacter() {
        const ctx = this.characterCtx;
        const canvas = this.elements.characterCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置绘制样式
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 绘制火柴人
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // 头部
        ctx.beginPath();
        ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX, centerY + 20);
        ctx.stroke();
        
        // 手臂（摆动动画）
        const armSwing = Math.sin(this.walkingFrame * Math.PI / 2) * 5;
        ctx.beginPath();
        ctx.moveTo(centerX - 20, centerY - armSwing);
        ctx.lineTo(centerX + 20, centerY + armSwing);
        ctx.stroke();
        
        // 腿（踏步动画）
        const leftLegOffset = this.walkingFrame % 2 === 0 ? 5 : -5;
        const rightLegOffset = this.walkingFrame % 2 === 0 ? -5 : 5;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX - 15 + leftLegOffset, centerY + 50);
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX + 15 + rightLegOffset, centerY + 50);
        ctx.stroke();
        
        // 绘制武器
        this.drawWeapon(ctx, centerX, centerY);
    }
    
    drawWeapon(ctx, centerX, centerY) {
        const weapon = this.saveData.equipment.weapon;
        if (!weapon) return;
        
        ctx.strokeStyle = '#ffd700'; // 武器用金色
        ctx.lineWidth = 4;
        
        // 根据武器类型绘制不同的武器
        if (weapon.name.includes('匕首')) {
            // 匕首 - 短小精悍
            ctx.beginPath();
            ctx.moveTo(centerX + 25, centerY - 10);
            ctx.lineTo(centerX + 35, centerY - 25);
            ctx.lineTo(centerX + 33, centerY - 30);
            ctx.lineTo(centerX + 23, centerY - 15);
            ctx.closePath();
            ctx.stroke();
            
            // 护手
            ctx.beginPath();
            ctx.moveTo(centerX + 23, centerY - 15);
            ctx.lineTo(centerX + 27, centerY - 5);
            ctx.stroke();
            
        } else if (weapon.name.includes('剑')) {
            // 剑 - 经典长剑
            ctx.beginPath();
            ctx.moveTo(centerX + 25, centerY - 10);
            ctx.lineTo(centerX + 30, centerY - 40);
            ctx.stroke();
            
            // 剑柄
            ctx.beginPath();
            ctx.moveTo(centerX + 25, centerY - 10);
            ctx.lineTo(centerX + 20, centerY - 5);
            ctx.lineTo(centerX + 30, centerY - 5);
            ctx.closePath();
            ctx.stroke();
            
            // 护手
            ctx.beginPath();
            ctx.moveTo(centerX + 20, centerY - 5);
            ctx.lineTo(centerX + 30, centerY - 5);
            ctx.stroke();
            
        } else if (weapon.name.includes('斧')) {
            // 斧头 - 大型武器
            ctx.beginPath();
            ctx.moveTo(centerX + 25, centerY - 15);
            ctx.lineTo(centerX + 35, centerY - 20);
            ctx.lineTo(centerX + 40, centerY - 10);
            ctx.lineTo(centerX + 30, centerY - 5);
            ctx.closePath();
            ctx.stroke();
            
            // 斧柄
            ctx.beginPath();
            ctx.moveTo(centerX + 30, centerY - 5);
            ctx.lineTo(centerX + 25, centerY + 10);
            ctx.stroke();
        }
        
        // 恢复默认样式
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
    }
    
    drawBattleCharacters() {
        // 绘制玩家（白色）
        this.drawFighter(this.playerCtx, this.elements.playerCanvas, '#fff', 'player');
        
        // 绘制敌人
        this.drawFighter(this.enemyCtx, this.elements.enemyCanvas, '#ff6b6b', 'enemy');
    }
    
    drawFighter(ctx, canvas, color, type) {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置绘制样式
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 绘制火柴人
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        if (type === 'player') {
            // 绘制玩家火柴人
            // 头部
            ctx.beginPath();
            ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
            ctx.stroke();
            
            // 身体
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 15);
            ctx.lineTo(centerX, centerY + 20);
            ctx.stroke();
            
            // 手臂
            const armSwing = this.isAttacking ? 10 : 0;
            ctx.beginPath();
            ctx.moveTo(centerX - 20, centerY - armSwing);
            ctx.lineTo(centerX + 20, centerY + armSwing);
            ctx.stroke();
            
            // 腿
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + 20);
            ctx.lineTo(centerX - 15, centerY + 50);
            ctx.moveTo(centerX, centerY + 20);
            ctx.lineTo(centerX + 15, centerY + 50);
            ctx.stroke();
            
            // 绘制武器
            this.drawBattleWeapon(ctx, centerX, centerY);
            
            // 绘制生命值条
            this.drawHealthBar(ctx, canvas, this.player.health, this.player.maxHealth);
            
        } else {
            // 绘制敌人（根据类型不同）
            if (this.currentEnemy.name.includes('哥布林')) {
                // 哥布林 - 小个子
                ctx.beginPath();
                ctx.arc(centerX, centerY - 20, 12, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 8);
                ctx.lineTo(centerX, centerY + 15);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX - 15, centerY);
                ctx.lineTo(centerX + 15, centerY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 15);
                ctx.lineTo(centerX - 12, centerY + 40);
                ctx.moveTo(centerX, centerY + 15);
                ctx.lineTo(centerX + 12, centerY + 40);
                ctx.stroke();
            } else if (this.currentEnemy.name.includes('骷髅')) {
                // 骷髅 - 骨架感
                ctx.beginPath();
                ctx.arc(centerX, centerY - 25, 12, 0, Math.PI * 2);
                ctx.stroke();
                
                // 脊柱
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 13);
                ctx.lineTo(centerX, centerY + 20);
                ctx.stroke();
                
                // 手臂骨骼
                ctx.beginPath();
                ctx.moveTo(centerX - 18, centerY - 5);
                ctx.lineTo(centerX + 18, centerY - 5);
                ctx.stroke();
                
                // 腿骨
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 20);
                ctx.lineTo(centerX - 10, centerY + 45);
                ctx.moveTo(centerX, centerY + 20);
                ctx.lineTo(centerX + 10, centerY + 45);
                ctx.stroke();
            } else if (this.currentEnemy.name.includes('野狼')) {
                // 野狼 - 四足动物
                ctx.beginPath();
                ctx.arc(centerX, centerY - 25, 14, 0, Math.PI * 2);
                ctx.stroke();
                
                // 身体（倾斜）
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 11);
                ctx.lineTo(centerX + 10, centerY + 15);
                ctx.stroke();
                
                // 前腿
                ctx.beginPath();
                ctx.moveTo(centerX + 10, centerY + 15);
                ctx.lineTo(centerX + 5, centerY + 35);
                ctx.moveTo(centerX + 10, centerY + 15);
                ctx.lineTo(centerX + 15, centerY + 35);
                ctx.stroke();
                
                // 后腿
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 15);
                ctx.lineTo(centerX - 5, centerY + 40);
                ctx.moveTo(centerX, centerY + 15);
                ctx.lineTo(centerX + 5, centerY + 40);
                ctx.stroke();
                
                // 尾巴
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.quadraticCurveTo(centerX - 20, centerY + 10, centerX - 25, centerY);
                ctx.stroke();
            } else if (this.currentEnemy.name.includes('强盗')) {
                // 强盗 - 类似人类但更大
                ctx.beginPath();
                ctx.arc(centerX, centerY - 35, 16, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 19);
                ctx.lineTo(centerX, centerY + 25);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX - 25, centerY);
                ctx.lineTo(centerX + 25, centerY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 25);
                ctx.lineTo(centerX - 18, centerY + 55);
                ctx.moveTo(centerX, centerY + 25);
                ctx.lineTo(centerX + 18, centerY + 55);
                ctx.stroke();
            } else if (this.currentEnemy.name.includes('暗影')) {
                // 暗影刺客 - 瘦长
                ctx.beginPath();
                ctx.arc(centerX, centerY - 30, 10, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 20);
                ctx.lineTo(centerX, centerY + 30);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX - 20, centerY);
                ctx.lineTo(centerX + 20, centerY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 30);
                ctx.lineTo(centerX - 12, centerY + 60);
                ctx.moveTo(centerX, centerY + 30);
                ctx.lineTo(centerX + 12, centerY + 60);
                ctx.stroke();
            } else if (this.currentEnemy.name.includes('石像')) {
                // 石像鬼 - 石头质感
                ctx.beginPath();
                ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                // 粗壮身体
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 15);
                ctx.lineTo(centerX, centerY + 20);
                ctx.stroke();
                
                // 翅膀
                ctx.beginPath();
                ctx.moveTo(centerX - 15, centerY - 5);
                ctx.lineTo(centerX - 30, centerY + 5);
                ctx.moveTo(centerX + 15, centerY - 5);
                ctx.lineTo(centerX + 30, centerY + 5);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX - 25, centerY);
                ctx.lineTo(centerX + 25, centerY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 20);
                ctx.lineTo(centerX - 15, centerY + 50);
                ctx.moveTo(centerX, centerY + 20);
                ctx.lineTo(centerX + 15, centerY + 50);
                ctx.stroke();
            } else {
                // 默认敌人 - 大个子
                ctx.beginPath();
                ctx.arc(centerX, centerY - 35, 18, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 17);
                ctx.lineTo(centerX, centerY + 25);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX - 25, centerY);
                ctx.lineTo(centerX + 25, centerY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 25);
                ctx.lineTo(centerX - 20, centerY + 55);
                ctx.moveTo(centerX, centerY + 25);
                ctx.lineTo(centerX + 20, centerY + 55);
                ctx.stroke();
            }
            
            // 绘制敌人生命值条
            this.drawHealthBar(ctx, canvas, this.currentEnemy.health, this.currentEnemy.maxHealth);
        }
    }
    
    drawBattleWeapon(ctx, centerX, centerY) {
        const weapon = this.saveData.equipment.weapon;
        if (!weapon) return;
        
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 4;
        
        // 攻击动画偏移
        const attackOffset = this.isAttacking ? 10 : 0;
        
        if (weapon.name.includes('匕首')) {
            // 匕首 - 快速刺击
            ctx.beginPath();
            ctx.moveTo(centerX + 25 + attackOffset, centerY - 10);
            ctx.lineTo(centerX + 35 + attackOffset, centerY - 25);
            ctx.lineTo(centerX + 33 + attackOffset, centerY - 30);
            ctx.lineTo(centerX + 23 + attackOffset, centerY - 15);
            ctx.closePath();
            ctx.stroke();
            
        } else if (weapon.name.includes('剑')) {
            // 剑 - 刺击动作
            ctx.beginPath();
            ctx.moveTo(centerX + 25 + attackOffset, centerY - 10);
            ctx.lineTo(centerX + 30 + attackOffset, centerY - 40);
            ctx.stroke();
            
            // 剑柄
            ctx.beginPath();
            ctx.moveTo(centerX + 25, centerY - 10);
            ctx.lineTo(centerX + 20, centerY - 5);
            ctx.lineTo(centerX + 30, centerY - 5);
            ctx.closePath();
            ctx.stroke();
            
        } else if (weapon.name.includes('斧')) {
            // 斧 - 大力劈砍
            const swingAngle = this.isAttacking ? Math.PI / 6 : 0;
            const swingX = Math.sin(swingAngle) * 15;
            const swingY = Math.cos(swingAngle) * 15;
            
            ctx.beginPath();
            ctx.moveTo(centerX + 25 + swingX, centerY - 15 + swingY);
            ctx.lineTo(centerX + 35 + swingX, centerY - 20 + swingY);
            ctx.lineTo(centerX + 40 + swingX, centerY - 10 + swingY);
            ctx.lineTo(centerX + 30 + swingX, centerY - 5 + swingY);
            ctx.closePath();
            ctx.stroke();
        }
        
        // 恢复默认样式
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
    }
    
    drawHealthBar(ctx, canvas, health, maxHealth) {
        const barWidth = 80;
        const barHeight = 6;
        const barX = (canvas.width - barWidth) / 2;
        const barY = canvas.height - 20;
        
        // 背景
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 生命值
        const healthPercent = health / maxHealth;
        ctx.fillStyle = healthPercent > 0.3 ? '#27ae60' : '#e74c3c';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // 边框
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    startWalkingAnimation() {
        this.walkingAnimation = setInterval(() => {
            this.walkingFrame = (this.walkingFrame + 1) % 4;
            this.drawCharacter();
        }, 200);
    }
    
    drawFighter(ctx, canvas, color, type) {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置绘制样式
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 绘制火柴人
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        if (type === 'player') {
            // 绘制火柴人（玩家）
            // 头部
            ctx.beginPath();
            ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
            ctx.stroke();
            
            // 身体
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 15);
            ctx.lineTo(centerX, centerY + 20);
            ctx.stroke();
            
            // 手臂（举起武器姿态）
            ctx.beginPath();
            ctx.moveTo(centerX - 20, centerY - 5);
            ctx.lineTo(centerX, centerY);
            ctx.lineTo(centerX + 25, centerY - 10);
            ctx.stroke();
            
            // 腿
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + 20);
            ctx.lineTo(centerX - 15, centerY + 50);
            ctx.moveTo(centerX, centerY + 20);
            ctx.lineTo(centerX + 15, centerY + 50);
            ctx.stroke();
            
            // 武器（简单的剑）
            ctx.beginPath();
            ctx.moveTo(centerX + 25, centerY - 10);
            ctx.lineTo(centerX + 30, centerY - 35);
            ctx.stroke();
        } else {
            // 绘制敌人（根据类型不同）
            if (this.currentEnemy.name.includes('哥布林')) {
                // 哥布林 - 小个子
                ctx.beginPath();
                ctx.arc(centerX, centerY - 20, 12, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 8);
                ctx.lineTo(centerX, centerY + 15);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX - 15, centerY);
                ctx.lineTo(centerX + 15, centerY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 15);
                ctx.lineTo(centerX - 12, centerY + 40);
                ctx.moveTo(centerX, centerY + 15);
                ctx.lineTo(centerX + 12, centerY + 40);
                ctx.stroke();
            } else if (this.currentEnemy.name.includes('骷髅')) {
                // 骷髅 - 骨架感
                ctx.beginPath();
                ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                // 身体（骨架）
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 15);
                ctx.lineTo(centerX, centerY + 25);
                ctx.stroke();
                
                // 手臂（骨头状）
                ctx.beginPath();
                ctx.moveTo(centerX - 20, centerY - 5);
                ctx.lineTo(centerX + 20, centerY - 5);
                ctx.stroke();
                
                // 腿
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 20);
                ctx.lineTo(centerX - 15, centerY + 50);
                ctx.moveTo(centerX, centerY + 20);
                ctx.lineTo(centerX + 15, centerY + 50);
                ctx.stroke();
            }
        }
    }
    
    stopWalkingAnimation() {
        if (this.walkingAnimation) {
            clearInterval(this.walkingAnimation);
            this.walkingAnimation = null;
        }
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new StickManAdventure();
});
