// 泰拉瑞亚风格像素画武器精灵系统
class WeaponSpriteSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.spriteSize = 32; // 32x32像素画布
        this.canvas.width = this.spriteSize;
        this.canvas.height = this.spriteSize;
        
        // 武器像素画数据
        this.weaponSprites = {
            // 白色品质武器 - 基础外观
            'wooden_sword': this.drawWoodenSword(),
            'copper_shortsword': this.drawCopperShortsword(),
            'rusty_dagger': this.drawRustyDagger(),
            'stone_hammer': this.drawStoneHammer(),
            'wooden_bow': this.drawWoodenBow(),
            'bronze_spear': this.drawBronzeSpear(),
            
            // 绿色品质武器 - 精良外观
            'iron_sword': this.drawIronSword(),
            'silver_dagger': this.drawSilverDagger(),
            'war_hammer': this.drawWarHammer(),
            'composite_bow': this.drawCompositeBow(),
            'steel_spear': this.drawSteelSpear(),
            'twin_knives': this.drawTwinKnives(),
            'iron_club': this.drawIronClub(),
            
            // 蓝色品质武器 - 稀有外观
            'gold_sword': this.drawGoldSword(),
            'shadow_blade': this.drawShadowBlade(),
            'battle_axe': this.drawBattleAxe(),
            'elven_bow': this.drawElvenBow(),
            'crystal_spear': this.drawCrystalSpear(),
            'flaming_sword': this.drawFlamingSword(),
            'frost_hammer': this.drawFrostHammer(),
            'lightning_dagger': this.drawLightningDagger(),
            
            // 紫色品质武器 - 史诗外观
            'excalibur': this.drawExcalibur(),
            'muramasa': this.drawMuramasa(),
            'dragon_slayer': this.drawDragonSlayer(),
            'phoenix_bow': this.drawPhoenixBow(),
            'gungnir': this.drawGungnir(),
            'blade_of_abyss': this.drawBladeOfAbyss(),
            'thor_hammer': this.drawThorHammer(),
            'celestial_sword': this.drawCelestialSword()
        };
    }
    
    // 获取武器精灵图
    getWeaponSprite(weaponId) {
        if (this.weaponSprites[weaponId]) {
            return this.weaponSprites[weaponId];
        }
        
        // 默认武器
        return this.drawDefaultWeapon();
    }
    
    // 木剑 - 简单的木制剑
    drawWoodenSword() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 棕色
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(12, 20, 8, 10);
        
        // 护手 - 深棕色
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(10, 18, 12, 3);
        
        // 剑刃 - 浅木色
        this.ctx.fillStyle = '#DEB887';
        this.ctx.fillRect(14, 2, 4, 16);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 木纹
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(15, 5, 2, 12);
        
        return this.canvas.toDataURL();
    }
    
    // 铜短剑 - 铜制短剑
    drawCopperShortsword() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 深棕色
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 铜色
        this.ctx.fillStyle = '#B87333';
        this.ctx.fillRect(8, 20, 16, 3);
        
        // 剑刃 - 铜色
        this.ctx.fillStyle = '#CD7F32';
        this.ctx.fillRect(14, 4, 4, 16);
        
        // 剑尖
        this.ctx.fillRect(13, 2, 6, 3);
        
        // 高光
        this.ctx.fillStyle = '#E4A853';
        this.ctx.fillRect(15, 6, 1, 10);
        
        return this.canvas.toDataURL();
    }
    
    // 生锈匕首 - 铁锈匕首
    drawRustyDagger() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 手柄 - 深棕色
        this.ctx.fillStyle = '#4A4A4A';
        this.ctx.fillRect(13, 24, 6, 6);
        
        // 护手 - 铁锈色
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(11, 22, 10, 2);
        
        // 刀刃 - 铁锈色
        this.ctx.fillStyle = '#A0522D';
        this.ctx.fillRect(15, 8, 2, 14);
        
        // 刀尖
        this.ctx.fillRect(14, 6, 4, 3);
        
        // 锈迹
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(16, 10, 1, 8);
        
        return this.canvas.toDataURL();
    }
    
    // 石锤 - 石制锤子
    drawStoneHammer() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 锤柄 - 木色
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(14, 16, 4, 14);
        
        // 锤头 - 石灰色
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(8, 8, 16, 10);
        
        // 锤头顶部
        this.ctx.fillRect(10, 6, 12, 3);
        
        // 石头纹理
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(10, 10, 3, 3);
        this.ctx.fillRect(18, 12, 3, 3);
        this.ctx.fillRect(14, 14, 2, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 木弓 - 简单木弓
    drawWoodenBow() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 弓身 - 木色弧形
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(16, 16, 12, Math.PI * 0.2, Math.PI * 0.8, false);
        this.ctx.stroke();
        
        // 弓弦 - 白色
        this.ctx.strokeStyle = '#F5F5DC';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(8, 20);
        this.ctx.lineTo(24, 20);
        this.ctx.stroke();
        
        // 装饰
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(15, 15, 2, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 青铜矛 - 青铜长矛
    drawBronzeSpear() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 矛柄 - 木色
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(15, 12, 2, 18);
        
        // 矛头 - 青铜色
        this.ctx.fillStyle = '#CD7F32';
        this.ctx.fillRect(14, 4, 4, 8);
        
        // 矛尖
        this.ctx.fillRect(13, 2, 6, 3);
        
        // 高光
        this.ctx.fillStyle = '#E4A853';
        this.ctx.fillRect(15, 6, 1, 4);
        
        return this.canvas.toDataURL();
    }
    
    // 铁剑 - 铁制长剑
    drawIronSword() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 深棕色
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 铁色
        this.ctx.fillStyle = '#708090';
        this.ctx.fillRect(8, 20, 16, 3);
        
        // 剑刃 - 铁色
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(14, 2, 4, 18);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 剑脊
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(15, 4, 2, 14);
        
        return this.canvas.toDataURL();
    }
    
    // 银匕首 - 银制匕首
    drawSilverDagger() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 手柄 - 蓝色
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(13, 24, 6, 6);
        
        // 护手 - 银色
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(11, 22, 10, 2);
        
        // 刀刃 - 银色
        this.ctx.fillStyle = '#E5E5E5';
        this.ctx.fillRect(15, 8, 2, 14);
        
        // 刀尖
        this.ctx.fillRect(14, 6, 4, 3);
        
        // 高光
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(16, 10, 1, 8);
        
        return this.canvas.toDataURL();
    }
    
    // 战锤 - 大型战锤
    drawWarHammer() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 锤柄 - 深棕色
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(14, 18, 4, 12);
        
        // 锤头 - 铁色
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(6, 10, 20, 10);
        
        // 锤头顶部
        this.ctx.fillRect(8, 8, 16, 3);
        
        // 钉子
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(10, 12, 2, 2);
        this.ctx.fillRect(18, 12, 2, 2);
        this.ctx.fillRect(14, 14, 2, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 复合弓 - 精良弓
    drawCompositeBow() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 弓身 - 深木色
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(16, 16, 12, Math.PI * 0.15, Math.PI * 0.85, false);
        this.ctx.stroke();
        
        // 弓弦 - 白色
        this.ctx.strokeStyle = '#F5F5DC';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(7, 20);
        this.ctx.lineTo(25, 20);
        this.ctx.stroke();
        
        // 装饰纹
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(14, 14, 4, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 钢矛 - 钢制长矛
    drawSteelSpear() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 矛柄 - 深木色
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(15, 10, 2, 20);
        
        // 矛头 - 钢色
        this.ctx.fillStyle = '#708090';
        this.ctx.fillRect(14, 2, 4, 8);
        
        // 矛尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 血槽
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(15, 4, 1, 4);
        
        return this.canvas.toDataURL();
    }
    
    // 双刀 - 双持匕首
    drawTwinKnives() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 左刀
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(8, 12, 2, 12);
        this.ctx.fillRect(7, 10, 4, 3);
        this.ctx.fillRect(6, 8, 6, 3);
        
        // 右刀
        this.ctx.fillRect(22, 12, 2, 12);
        this.ctx.fillRect(21, 10, 4, 3);
        this.ctx.fillRect(20, 8, 6, 3);
        
        // 护手
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(6, 22, 4, 2);
        this.ctx.fillRect(22, 22, 4, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 铁棒 - 简单铁棒
    drawIronClub() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 棒身 - 铁色
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(12, 8, 8, 22);
        
        // 顶端 - 加粗
        this.ctx.fillRect(10, 6, 12, 4);
        
        // 纹理
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(14, 12, 4, 2);
        this.ctx.fillRect(14, 18, 4, 2);
        this.ctx.fillRect(14, 24, 4, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 黄金剑 - 金色长剑
    drawGoldSword() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 红色
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 金色
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(8, 20, 16, 3);
        
        // 剑刃 - 金色
        this.ctx.fillStyle = '#FFA500';
        this.ctx.fillRect(14, 2, 4, 18);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 发光效果
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillRect(15, 4, 2, 12);
        
        return this.canvas.toDataURL();
    }
    
    // 暗影之刃 - 暗影剑
    drawShadowBlade() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 紫色
        this.ctx.fillStyle = '#4B0082';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 暗紫色
        this.ctx.fillStyle = '#2F1B4D';
        this.ctx.fillRect(8, 20, 16, 3);
        
        // 剑刃 - 暗影色
        this.ctx.fillStyle = '#191970';
        this.ctx.fillRect(14, 2, 4, 18);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 暗影效果
        this.ctx.fillStyle = '#000080';
        this.ctx.fillRect(15, 4, 2, 14);
        
        return this.canvas.toDataURL();
    }
    
    // 战斧 - 大型战斧
    drawBattleAxe() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 斧柄 - 深棕色
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(14, 16, 4, 14);
        
        // 斧头 - 铁色
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(4, 8, 24, 10);
        
        // 斧刃
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(2, 10, 4, 6);
        this.ctx.fillRect(26, 10, 4, 6);
        
        // 中心装饰
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(14, 12, 4, 4);
        
        return this.canvas.toDataURL();
    }
    
    // 精灵弓 - 精灵风格弓
    drawElvenBow() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 弓身 - 绿色
        this.ctx.strokeStyle = '#228B22';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(16, 16, 12, Math.PI * 0.1, Math.PI * 0.9, false);
        this.ctx.stroke();
        
        // 弓弦 - 银色
        this.ctx.strokeStyle = '#C0C0C0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(6, 20);
        this.ctx.lineTo(26, 20);
        this.ctx.stroke();
        
        // 叶子装饰
        this.ctx.fillStyle = '#32CD32';
        this.ctx.fillRect(14, 14, 4, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 水晶矛 - 水晶长矛
    drawCrystalSpear() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 矛柄 - 银色
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(15, 10, 2, 20);
        
        // 矛头 - 水晶色
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(14, 2, 4, 8);
        
        // 矛尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 水晶光泽
        this.ctx.fillStyle = '#B0E0E6';
        this.ctx.fillRect(15, 4, 1, 4);
        
        return this.canvas.toDataURL();
    }
    
    // 烈焰之剑 - 火焰剑
    drawFlamingSword() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 黑色
        this.ctx.fillStyle = '#1C1C1C';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 火焰色
        this.ctx.fillStyle = '#FF4500';
        this.ctx.fillRect(8, 20, 16, 3);
        
        // 剑刃 - 火焰色
        this.ctx.fillStyle = '#FF6347';
        this.ctx.fillRect(14, 2, 4, 18);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 火焰效果
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(15, 4, 2, 12);
        
        return this.canvas.toDataURL();
    }
    
    // 冰霜战锤 - 冰霜锤
    drawFrostHammer() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 锤柄 - 冰蓝色
        this.ctx.fillStyle = '#4682B4';
        this.ctx.fillRect(14, 18, 4, 12);
        
        // 锤头 - 冰色
        this.ctx.fillStyle = '#B0E0E6';
        this.ctx.fillRect(6, 10, 20, 10);
        
        // 锤头顶部
        this.ctx.fillRect(8, 8, 16, 3);
        
        // 冰晶效果
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(10, 12, 3, 3);
        this.ctx.fillRect(18, 12, 3, 3);
        this.ctx.fillRect(14, 14, 2, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 雷光匕首 - 雷电匕首
    drawLightningDagger() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 手柄 - 黄色
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(13, 24, 6, 6);
        
        // 护手 - 雷电色
        this.ctx.fillStyle = '#FFA500';
        this.ctx.fillRect(11, 22, 10, 2);
        
        // 刀刃 - 雷电色
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillRect(15, 8, 2, 14);
        
        // 刀尖
        this.ctx.fillRect(14, 6, 4, 3);
        
        // 闪电效果
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(16, 10, 1, 8);
        
        return this.canvas.toDataURL();
    }
    
    // 石中剑 - 传奇剑
    drawExcalibur() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 金色
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(12, 20, 8, 10);
        
        // 护手 - 王者色
        this.ctx.fillStyle = '#4B0082';
        this.ctx.fillRect(6, 18, 20, 3);
        
        // 剑刃 - 神圣色
        this.ctx.fillStyle = '#F0E68C';
        this.ctx.fillRect(14, 2, 4, 16);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 神圣光辉
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(15, 4, 2, 12);
        
        // 宝石
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(14, 19, 4, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 村正 - 日本刀
    drawMuramasa() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 黑色
        this.ctx.fillStyle = '#1C1C1C';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 方形
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(10, 20, 12, 3);
        
        // 剑刃 - 钢色
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(14, 2, 4, 18);
        
        // 剑尖 - 弯曲
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 刀纹
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(15, 4, 2, 14);
        
        return this.canvas.toDataURL();
    }
    
    // 屠龙斧 - 巨型斧
    drawDragonSlayer() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 斧柄 - 深红色
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(14, 16, 4, 14);
        
        // 斧头 - 龙鳞色
        this.ctx.fillStyle = '#2F4F2F';
        this.ctx.fillRect(2, 6, 28, 12);
        
        // 斧刃 - 银色
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(0, 8, 4, 8);
        this.ctx.fillRect(28, 8, 4, 8);
        
        // 龙纹
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(14, 10, 4, 4);
        
        return this.canvas.toDataURL();
    }
    
    // 凤凰弓 - 火焰弓
    drawPhoenixBow() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 弓身 - 火焰色
        this.ctx.strokeStyle = '#FF4500';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(16, 16, 12, Math.PI * 0.1, Math.PI * 0.9, false);
        this.ctx.stroke();
        
        // 弓弦 - 金色
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(6, 20);
        this.ctx.lineTo(26, 20);
        this.ctx.stroke();
        
        // 火焰装饰
        this.ctx.fillStyle = '#FF6347';
        this.ctx.fillRect(14, 14, 4, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 永恒之枪 - 神枪
    drawGungnir() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 矛柄 - 金色
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(15, 8, 2, 22);
        
        // 矛头 - 神圣色
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(13, 2, 6, 6);
        
        // 矛尖
        this.ctx.fillRect(12, 0, 8, 3);
        
        // 神圣符文
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(15, 4, 2, 2);
        
        return this.canvas.toDataURL();
    }
    
    // 深渊之刃 - 邪恶剑
    drawBladeOfAbyss() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 紫黑色
        this.ctx.fillStyle = '#191970';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 邪恶色
        this.ctx.fillStyle = '#4B0082';
        this.ctx.fillRect(8, 20, 16, 3);
        
        // 剑刃 - 深紫色
        this.ctx.fillStyle = '#2F1B4D';
        this.ctx.fillRect(14, 2, 4, 18);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 邪恶光环
        this.ctx.fillStyle = '#8B008B';
        this.ctx.fillRect(15, 4, 2, 14);
        
        return this.canvas.toDataURL();
    }
    
    // 雷神之锤 - 神锤
    drawThorHammer() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 锤柄 - 深木色
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(14, 16, 4, 14);
        
        // 锤头 - 雷电色
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(4, 8, 24, 10);
        
        // 锤头顶部
        this.ctx.fillRect(6, 6, 20, 3);
        
        // 雷电符号
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(14, 10, 4, 4);
        
        return this.canvas.toDataURL();
    }
    
    // 天界圣剑 - 天堂剑
    drawCelestialSword() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 剑柄 - 白金色
        this.ctx.fillStyle = '#F0E68C';
        this.ctx.fillRect(12, 22, 8, 8);
        
        // 护手 - 天界色
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(8, 20, 16, 3);
        
        // 剑刃 - 天界色
        this.ctx.fillStyle = '#E6E6FA';
        this.ctx.fillRect(14, 2, 4, 18);
        
        // 剑尖
        this.ctx.fillRect(13, 0, 6, 3);
        
        // 天使光环
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(15, 4, 2, 14);
        
        // 天使翅膀
        this.ctx.fillStyle = '#F0F8FF';
        this.ctx.fillRect(10, 8, 2, 4);
        this.ctx.fillRect(20, 8, 2, 4);
        
        return this.canvas.toDataURL();
    }
    
    // 默认武器
    drawDefaultWeapon() {
        this.ctx.clearRect(0, 0, this.spriteSize, this.spriteSize);
        
        // 简单剑形
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(14, 4, 4, 16);
        this.ctx.fillRect(13, 2, 6, 3);
        this.ctx.fillRect(12, 20, 8, 8);
        
        return this.canvas.toDataURL();
    }
}
