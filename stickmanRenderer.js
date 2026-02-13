// 火柴人渲染系统 - 参考 Stick Fight: The Game
class StickmanRenderer {
    constructor() {
        this.animationFrames = {
            idle: 0,
            walk: 0,
            attack: 0,
            hurt: 0,
            death: 0
        };
        this.animationSpeed = {
            idle: 0.1,
            walk: 0.2,
            attack: 0.3,
            hurt: 0.5,
            death: 0.3
        };
        this.currentState = 'idle';
        this.facing = 1; // 1为右，-1为左
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        this.health = 100;
        this.maxHealth = 100;
    }
    
    // 更新动画状态
    update(deltaTime, action = null) {
        // 根据动作更新状态
        if (action) {
            this.currentState = action;
        }
        
        // 更新动画帧
        const speed = this.animationSpeed[this.currentState];
        this.animationFrames[this.currentState] += speed * deltaTime;
        
        // 循环动画（除了死亡）
        if (this.currentState !== 'death') {
            const maxFrame = this.getMaxFrame(this.currentState);
            if (this.animationFrames[this.currentState] >= maxFrame) {
                this.animationFrames[this.currentState] = 0;
                
                // 攻击动画结束后回到idle
                if (this.currentState === 'attack') {
                    this.currentState = 'idle';
                }
                // 受伤动画结束后回到idle
                else if (this.currentState === 'hurt') {
                    this.currentState = 'idle';
                }
            }
        }
        
        // 更新物理
        this.updatePhysics(deltaTime);
    }
    
    // 获取最大帧数
    getMaxFrame(state) {
        const frames = {
            idle: 4,
            walk: 8,
            attack: 6,
            hurt: 4,
            death: 8
        };
        return frames[state] || 4;
    }
    
    // 更新物理
    updatePhysics(deltaTime) {
        // 重力
        if (!this.isGrounded) {
            this.velocity.y += 0.5;
        }
        
        // 更新位置
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // 地面检测
        if (this.position.y >= 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
        
        // 摩擦力
        this.velocity.x *= 0.9;
    }
    
    // 跳跃
    jump() {
        if (this.isGrounded) {
            this.velocity.y = -12;
            this.isGrounded = false;
        }
    }
    
    // 移动
    move(direction) {
        this.velocity.x = direction * 5;
        this.facing = direction;
        
        if (Math.abs(direction) > 0.1) {
            this.currentState = 'walk';
        } else {
            this.currentState = 'idle';
        }
    }
    
    // 攻击
    attack() {
        if (this.currentState !== 'attack' && this.currentState !== 'hurt') {
            this.currentState = 'attack';
            this.animationFrames.attack = 0;
        }
    }
    
    // 受伤
    hurt() {
        if (this.currentState !== 'death') {
            this.currentState = 'hurt';
            this.animationFrames.hurt = 0;
        }
    }
    
    // 死亡
    die() {
        this.currentState = 'death';
        this.animationFrames.death = 0;
    }
    
    // 渲染火柴人
    render(ctx, centerX, centerY, color = '#ffffff', scale = 1) {
        ctx.save();
        
        // 应用缩放
        ctx.scale(scale * this.facing, scale);
        
        // 获取当前动画帧
        const frame = Math.floor(this.animationFrames[this.currentState]);
        
        // 根据状态渲染不同姿势
        switch (this.currentState) {
            case 'idle':
                this.renderIdle(ctx, centerX / scale, centerY / scale, frame, color);
                break;
            case 'walk':
                this.renderWalk(ctx, centerX / scale, centerY / scale, frame, color);
                break;
            case 'attack':
                this.renderAttack(ctx, centerX / scale, centerY / scale, frame, color);
                break;
            case 'hurt':
                this.renderHurt(ctx, centerX / scale, centerY / scale, frame, color);
                break;
            case 'death':
                this.renderDeath(ctx, centerX / scale, centerY / scale, frame, color);
                break;
        }
        
        ctx.restore();
    }
    
    // 渲染待机动画
    renderIdle(ctx, x, y, frame, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 轻微呼吸效果
        const breathe = Math.sin(frame * 0.5) * 2;
        
        // 头部
        ctx.beginPath();
        ctx.arc(x, y - 30 + breathe, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(x, y - 15 + breathe);
        ctx.lineTo(x, y + 20 + breathe);
        ctx.stroke();
        
        // 手臂 - 轻微摆动
        const armSwing = Math.sin(frame * 0.3) * 5;
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 5 + armSwing);
        ctx.lineTo(x + 20, y - 5 - armSwing);
        ctx.stroke();
        
        // 腿部 - 轻微移动
        const legShift = Math.sin(frame * 0.4) * 3;
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x - 15 + legShift, y + 50);
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x + 15 - legShift, y + 50);
        ctx.stroke();
    }
    
    // 渲染行走动画
    renderWalk(ctx, x, y, frame, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 身体倾斜
        const lean = Math.sin(frame * 0.8) * 5;
        
        // 头部
        ctx.beginPath();
        ctx.arc(x + lean, y - 30, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(x + lean, y - 15);
        ctx.lineTo(x + lean, y + 20);
        ctx.stroke();
        
        // 手臂摆动
        const armSwing = Math.sin(frame * 0.8) * 15;
        ctx.beginPath();
        ctx.moveTo(x - 20 + armSwing, y - 5);
        ctx.lineTo(x + 20 - armSwing, y - 5);
        ctx.stroke();
        
        // 腿部行走
        const legSwing = Math.sin(frame * 0.8) * 20;
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x - 15 + legSwing, y + 50);
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x + 15 - legSwing, y + 50);
        ctx.stroke();
    }
    
    // 渲染攻击动画
    renderAttack(ctx, x, y, frame, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 攻击前倾
        const lunge = frame < 3 ? frame * 5 : (6 - frame) * 5;
        
        // 头部
        ctx.beginPath();
        ctx.arc(x + lunge, y - 30, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(x + lunge, y - 15);
        ctx.lineTo(x + lunge, y + 20);
        ctx.stroke();
        
        // 攻击手臂
        const attackArm = frame < 3 ? frame * 20 : 60 - (frame - 3) * 20;
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + attackArm, y - 10);
        ctx.stroke();
        
        // 另一只手臂
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x - 15, y + 5);
        ctx.stroke();
        
        // 腿部稳定
        ctx.beginPath();
        ctx.moveTo(x + lunge, y + 20);
        ctx.lineTo(x - 15, y + 50);
        ctx.moveTo(x + lunge, y + 20);
        ctx.lineTo(x + 15, y + 50);
        ctx.stroke();
    }
    
    // 渲染受伤动画
    renderHurt(ctx, x, y, frame, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 受伤后仰
        const recoil = frame * 10;
        
        // 头部
        ctx.beginPath();
        ctx.arc(x - recoil, y - 30, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(x - recoil, y - 15);
        ctx.lineTo(x - recoil, y + 20);
        ctx.stroke();
        
        // 手臂 - 无力下垂
        ctx.beginPath();
        ctx.moveTo(x - 20 - recoil, y);
        ctx.lineTo(x + 20 - recoil, y);
        ctx.stroke();
        
        // 腿部 - 不稳定
        ctx.beginPath();
        ctx.moveTo(x - recoil, y + 20);
        ctx.lineTo(x - 25, y + 50);
        ctx.moveTo(x - recoil, y + 20);
        ctx.lineTo(x + 5, y + 50);
        ctx.stroke();
    }
    
    // 渲染死亡动画
    renderDeath(ctx, x, y, frame, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 死亡倒下
        const fallAngle = (frame / 8) * Math.PI / 2;
        const fallX = Math.sin(fallAngle) * 30;
        const fallY = (1 - Math.cos(fallAngle)) * 30;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(fallAngle);
        
        // 头部
        ctx.beginPath();
        ctx.arc(0, -30, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 20);
        ctx.stroke();
        
        // 手臂
        ctx.beginPath();
        ctx.moveTo(-20, -5);
        ctx.lineTo(20, -5);
        ctx.stroke();
        
        // 腿部
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(-15, 50);
        ctx.moveTo(0, 20);
        ctx.lineTo(15, 50);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 渲染武器
    renderWeapon(ctx, x, y, weaponType, frame, scale = 1) {
        const weaponSprite = this.getWeaponSprite(weaponType);
        if (!weaponSprite) return;
        
        ctx.save();
        
        // 根据动画帧调整武器位置
        let weaponX = x + 25;
        let weaponY = y - 20;
        let rotation = 0;
        
        if (this.currentState === 'attack') {
            const attackProgress = frame / 6;
            weaponX += attackProgress * 30;
            weaponY -= attackProgress * 10;
            rotation = -attackProgress * Math.PI / 4;
        } else if (this.currentState === 'walk') {
            weaponY += Math.sin(frame * 0.8) * 3;
        }
        
        ctx.translate(weaponX, weaponY);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        
        // 绘制武器形状（简化版）
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#ffd700';
        
        switch (weaponType) {
            case 'sword':
                this.renderSword(ctx);
                break;
            case 'axe':
                this.renderAxe(ctx);
                break;
            case 'hammer':
                this.renderHammer(ctx);
                break;
            case 'dagger':
                this.renderDagger(ctx);
                break;
            case 'spear':
                this.renderSpear(ctx);
                break;
            case 'bow':
                this.renderBow(ctx);
                break;
            default:
                this.renderDefaultWeapon(ctx);
        }
        
        ctx.restore();
    }
    
    // 渲染剑
    renderSword(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 10);
        ctx.stroke();
        
        // 剑柄
        ctx.fillRect(-5, 10, 10, 8);
        
        // 护手
        ctx.beginPath();
        ctx.moveTo(-8, 10);
        ctx.lineTo(8, 10);
        ctx.stroke();
    }
    
    // 渲染斧
    renderAxe(ctx) {
        // 斧头
        ctx.beginPath();
        ctx.moveTo(-10, -15);
        ctx.lineTo(10, -15);
        ctx.lineTo(8, -5);
        ctx.lineTo(-8, -5);
        ctx.closePath();
        ctx.fill();
        
        // 斧柄
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 15);
        ctx.stroke();
    }
    
    // 渲染锤
    renderHammer(ctx) {
        // 锤头
        ctx.fillRect(-12, -20, 24, 10);
        
        // 锤柄
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 15);
        ctx.stroke();
    }
    
    // 渲染匕首
    renderDagger(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 5);
        ctx.stroke();
        
        // 匕首柄
        ctx.fillRect(-3, 5, 6, 6);
    }
    
    // 渲染矛
    renderSpear(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(0, 10);
        ctx.stroke();
        
        // 矛头
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(-5, -15);
        ctx.lineTo(5, -15);
        ctx.closePath();
        ctx.fill();
    }
    
    // 渲染弓
    renderBow(ctx) {
        ctx.beginPath();
        ctx.arc(0, -5, 15, Math.PI * 0.2, Math.PI * 0.8, false);
        ctx.stroke();
        
        // 弓弦
        ctx.beginPath();
        ctx.moveTo(-12, -5);
        ctx.lineTo(12, -5);
        ctx.stroke();
    }
    
    // 渲染默认武器
    renderDefaultWeapon(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 10);
        ctx.stroke();
    }
    
    // 获取武器精灵（这里可以集成现有的weaponSprites系统）
    getWeaponSprite(weaponType) {
        // 这里可以调用现有的WeaponSpriteSystem
        return null;
    }
}
