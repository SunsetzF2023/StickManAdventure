// 战斗动画系统 - 参考 Stick Fight: The Game
class BattleAnimationSystem {
    constructor() {
        this.animations = [];
        this.particles = [];
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
        this.hitEffects = [];
        this.combo = { count: 0, timer: 0, x: 0, y: 0 };
    }
    
    // 更新所有动画
    update(deltaTime) {
        // 更新动画
        this.animations = this.animations.filter(anim => {
            anim.elapsed += deltaTime;
            return anim.elapsed < anim.duration;
        });
        
        // 更新粒子效果
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity || 0;
            particle.life -= particle.decay;
            particle.scale *= particle.scaleDecay || 1;
            return particle.life > 0;
        });
        
        // 更新屏幕震动
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= deltaTime;
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
        }
        
        // 更新连击计时器
        if (this.combo.timer > 0) {
            this.combo.timer -= deltaTime;
        } else {
            this.combo.count = 0;
        }
        
        // 更新击中效果
        this.hitEffects = this.hitEffects.filter(effect => {
            effect.elapsed += deltaTime;
            return effect.elapsed < effect.duration;
        });
    }
    
    // 添加攻击动画
    addAttackAnimation(attacker, target, weaponType) {
        const attackAnim = {
            type: 'attack',
            attacker: attacker,
            target: target,
            weaponType: weaponType,
            elapsed: 0,
            duration: 300, // 0.3秒
            startX: attacker.x,
            startY: attacker.y,
            endX: target.x,
            endY: target.y
        };
        
        this.animations.push(attackAnim);
        
        // 添加武器轨迹粒子
        this.addWeaponTrail(attacker, target, weaponType);
    }
    
    // 添加武器轨迹
    addWeaponTrail(attacker, target, weaponType) {
        const steps = 10;
        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const x = attacker.x + (target.x - attacker.x) * progress;
            const y = attacker.y + (target.y - attacker.y) * progress;
            
            this.particles.push({
                type: 'weapon_trail',
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: 0.05,
                scale: 1,
                scaleDecay: 0.98,
                color: this.getWeaponTrailColor(weaponType),
                size: 3 + Math.random() * 3
            });
        }
    }
    
    // 获取武器轨迹颜色
    getWeaponTrailColor(weaponType) {
        const colors = {
            sword: '#ffd700',
            axe: '#ff6b6b',
            hammer: '#8b4513',
            dagger: '#c0c0c0',
            spear: '#708090',
            bow: '#8fbc8f',
            club: '#696969',
            knife: '#dcdcdc'
        };
        return colors[weaponType] || '#ffffff';
    }
    
    // 添加击中效果
    addHitEffect(target, damage, isCritical = false) {
        // 屏幕震动
        this.screenShake.intensity = isCritical ? 15 : 8;
        this.screenShake.duration = 200;
        
        // 击中闪光
        this.hitEffects.push({
            type: 'hit_flash',
            target: target,
            elapsed: 0,
            duration: 150,
            scale: isCritical ? 2 : 1.5
        });
        
        // 伤害数字
        this.addDamageNumber(target, damage, isCritical);
        
        // 血液粒子
        this.addBloodParticles(target, isCritical ? 15 : 8);
        
        // 击退效果
        this.addKnockback(target, isCritical ? 30 : 15);
        
        // 更新连击
        this.updateCombo(target);
    }
    
    // 添加伤害数字
    addDamageNumber(target, damage, isCritical) {
        const damageText = {
            type: 'damage_number',
            x: target.x + (Math.random() - 0.5) * 20,
            y: target.y - 20,
            vx: (Math.random() - 0.5) * 2,
            vy: -3,
            text: damage.toString(),
            life: 1,
            decay: 0.02,
            scale: isCritical ? 2 : 1.5,
            scaleDecay: 0.98,
            color: isCritical ? '#ff0000' : '#ffff00',
            isCritical: isCritical
        };
        
        this.particles.push(damageText);
    }
    
    // 添加血液粒子
    addBloodParticles(target, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 2 + Math.random() * 3;
            
            this.particles.push({
                type: 'blood',
                x: target.x,
                y: target.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                gravity: 0.2,
                life: 1,
                decay: 0.03,
                scale: 1,
                scaleDecay: 0.95,
                color: '#ff0000',
                size: 2 + Math.random() * 3
            });
        }
    }
    
    // 添加击退效果
    addKnockback(target, force) {
        const knockbackAnim = {
            type: 'knockback',
            target: target,
            elapsed: 0,
            duration: 200,
            force: force,
            originalX: target.x
        };
        
        this.animations.push(knockbackAnim);
    }
    
    // 更新连击
    updateCombo(target) {
        this.combo.count++;
        this.combo.timer = 2000; // 2秒内需要下一次攻击
        this.combo.x = target.x;
        this.combo.y = target.y - 40;
        
        // 连击特效
        if (this.combo.count >= 3) {
            this.addComboEffect();
        }
    }
    
    // 添加连击特效
    addComboEffect() {
        const comboEffect = {
            type: 'combo',
            x: this.combo.x,
            y: this.combo.y,
            elapsed: 0,
            duration: 1000,
            count: this.combo.count
        };
        
        this.animations.push(comboEffect);
        
        // 连击粒子
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 3 + Math.random() * 2;
            
            this.particles.push({
                type: 'combo_particle',
                x: this.combo.x,
                y: this.combo.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.02,
                scale: 1.5,
                scaleDecay: 0.96,
                color: `hsl(${this.combo.count * 30}, 100%, 50%)`,
                size: 3
            });
        }
    }
    
    // 添加死亡效果
    addDeathEffect(target) {
        // 大屏幕震动
        this.screenShake.intensity = 20;
        this.screenShake.duration = 500;
        
        // 爆炸粒子
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = 2 + Math.random() * 5;
            
            this.particles.push({
                type: 'death_particle',
                x: target.x,
                y: target.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                gravity: 0.3,
                life: 1,
                decay: 0.015,
                scale: 2,
                scaleDecay: 0.94,
                color: target.color || '#ff0000',
                size: 4 + Math.random() * 4
            });
        }
        
        // 死亡动画
        const deathAnim = {
            type: 'death',
            target: target,
            elapsed: 0,
            duration: 800
        };
        
        this.animations.push(deathAnim);
    }
    
    // 添加技能效果
    addSkillEffect(caster, skillType, target) {
        switch (skillType) {
            case 'dragon_breath':
                this.addDragonBreathEffect(caster, target);
                break;
            case 'life_drain':
                this.addLifeDrainEffect(caster, target);
                break;
            case 'stealth_attack':
                this.addStealthEffect(caster);
                break;
            case 'rage':
                this.addRageEffect(caster);
                break;
            case 'heal':
                this.addHealEffect(caster);
                break;
        }
    }
    
    // 龙息效果
    addDragonBreathEffect(caster, target) {
        const breathAnim = {
            type: 'dragon_breath',
            caster: caster,
            target: target,
            elapsed: 0,
            duration: 600
        };
        
        this.animations.push(breathAnim);
        
        // 火焰粒子
        for (let i = 0; i < 50; i++) {
            const progress = Math.random();
            const x = caster.x + (target.x - caster.x) * progress;
            const y = caster.y + (target.y - caster.y) * progress + (Math.random() - 0.5) * 20;
            
            this.particles.push({
                type: 'fire',
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3,
                gravity: -0.1,
                life: 1,
                decay: 0.025,
                scale: 1.5,
                scaleDecay: 0.96,
                color: `hsl(${Math.random() * 60}, 100%, 50%)`,
                size: 3 + Math.random() * 5
            });
        }
    }
    
    // 生命吸取效果
    addLifeDrainEffect(caster, target) {
        const drainAnim = {
            type: 'life_drain',
            caster: caster,
            target: target,
            elapsed: 0,
            duration: 400
        };
        
        this.animations.push(drainAnim);
        
        // 生命粒子
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                type: 'life_particle',
                x: target.x + (Math.random() - 0.5) * 30,
                y: target.y + (Math.random() - 0.5) * 30,
                vx: (caster.x - target.x) * 0.05,
                vy: (caster.y - target.y) * 0.05,
                life: 1,
                decay: 0.02,
                scale: 1,
                scaleDecay: 0.98,
                color: '#ff00ff',
                size: 3
            });
        }
    }
    
    // 潜行效果
    addStealthEffect(caster) {
        const stealthAnim = {
            type: 'stealth',
            target: caster,
            elapsed: 0,
            duration: 300
        };
        
        this.animations.push(stealthAnim);
        
        // 烟雾粒子
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                type: 'smoke',
                x: caster.x + (Math.random() - 0.5) * 40,
                y: caster.y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 1,
                vy: -Math.random() * 2,
                life: 1,
                decay: 0.015,
                scale: 2,
                scaleDecay: 0.96,
                color: '#808080',
                size: 5 + Math.random() * 5
            });
        }
    }
    
    // 愤怒效果
    addRageEffect(caster) {
        const rageAnim = {
            type: 'rage',
            target: caster,
            elapsed: 0,
            duration: 500
        };
        
        this.animations.push(rageAnim);
        
        // 愤怒光环
        for (let i = 0; i < 25; i++) {
            const angle = (Math.PI * 2 * i) / 25;
            const speed = 2;
            
            this.particles.push({
                type: 'rage_particle',
                x: caster.x,
                y: caster.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.02,
                scale: 1.5,
                scaleDecay: 0.94,
                color: '#ff0000',
                size: 3
            });
        }
    }
    
    // 治疗效果
    addHealEffect(target) {
        const healAnim = {
            type: 'heal',
            target: target,
            elapsed: 0,
            duration: 600
        };
        
        this.animations.push(healAnim);
        
        // 治疗粒子
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                type: 'heal_particle',
                x: target.x + (Math.random() - 0.5) * 30,
                y: target.y - 20,
                vx: (Math.random() - 0.5) * 1,
                vy: -Math.random() * 2 - 1,
                gravity: 0.05,
                life: 1,
                decay: 0.015,
                scale: 1.2,
                scaleDecay: 0.96,
                color: '#00ff00',
                size: 3 + Math.random() * 3
            });
        }
    }
    
    // 渲染所有效果
    render(ctx) {
        // 应用屏幕震动
        ctx.save();
        ctx.translate(this.screenShake.x, this.screenShake.y);
        
        // 渲染动画
        this.animations.forEach(anim => {
            this.renderAnimation(ctx, anim);
        });
        
        // 渲染粒子
        this.particles.forEach(particle => {
            this.renderParticle(ctx, particle);
        });
        
        // 渲染击中效果
        this.hitEffects.forEach(effect => {
            this.renderHitEffect(ctx, effect);
        });
        
        // 渲染连击
        if (this.combo.count > 0 && this.combo.timer > 0) {
            this.renderCombo(ctx);
        }
        
        ctx.restore();
    }
    
    // 渲染动画
    renderAnimation(ctx, anim) {
        const progress = anim.elapsed / anim.duration;
        
        switch (anim.type) {
            case 'attack':
                this.renderAttackAnimation(ctx, anim, progress);
                break;
            case 'knockback':
                this.renderKnockbackAnimation(ctx, anim, progress);
                break;
            case 'death':
                this.renderDeathAnimation(ctx, anim, progress);
                break;
            case 'dragon_breath':
                this.renderDragonBreathAnimation(ctx, anim, progress);
                break;
            case 'life_drain':
                this.renderLifeDrainAnimation(ctx, anim, progress);
                break;
            case 'stealth':
                this.renderStealthAnimation(ctx, anim, progress);
                break;
            case 'rage':
                this.renderRageAnimation(ctx, anim, progress);
                break;
            case 'heal':
                this.renderHealAnimation(ctx, anim, progress);
                break;
            case 'combo':
                this.renderComboAnimation(ctx, anim, progress);
                break;
        }
    }
    
    // 渲染攻击动画
    renderAttackAnimation(ctx, anim, progress) {
        // 快速移动效果
        const attackProgress = Math.min(progress * 2, 1);
        const x = anim.startX + (anim.endX - anim.startX) * attackProgress;
        const y = anim.startY + (anim.endY - anim.startY) * attackProgress;
        
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(anim.startX, anim.startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染击退动画
    renderKnockbackAnimation(ctx, anim, progress) {
        const knockbackDistance = anim.force * (1 - progress);
        anim.target.x = anim.originalX + knockbackDistance;
    }
    
    // 渲染死亡动画
    renderDeathAnimation(ctx, anim, progress) {
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.translate(anim.target.x, anim.target.y);
        ctx.rotate(progress * Math.PI * 2);
        ctx.scale(1 - progress * 0.5, 1 - progress * 0.5);
        ctx.translate(-anim.target.x, -anim.target.y);
        ctx.restore();
    }
    
    // 渲染龙息动画
    renderDragonBreathAnimation(ctx, anim, progress) {
        const gradient = ctx.createLinearGradient(
            anim.caster.x, anim.caster.y,
            anim.target.x, anim.target.y
        );
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0.4)');
        
        ctx.save();
        ctx.globalAlpha = 1 - progress * 0.5;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 20 * (1 - progress * 0.5);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(anim.caster.x, anim.caster.y);
        ctx.lineTo(anim.target.x, anim.target.y);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染生命吸取动画
    renderLifeDrainAnimation(ctx, anim, progress) {
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -progress * 20;
        ctx.beginPath();
        ctx.moveTo(anim.target.x, anim.target.y);
        ctx.lineTo(anim.caster.x, anim.caster.y);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染潜行动画
    renderStealthAnimation(ctx, anim, progress) {
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.arc(anim.target.x, anim.target.y, 30 * progress, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // 渲染愤怒动画
    renderRageAnimation(ctx, anim, progress) {
        ctx.save();
        ctx.globalAlpha = 0.7 * (1 - progress);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(anim.target.x, anim.target.y, 40 + progress * 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染治疗动画
    renderHealAnimation(ctx, anim, progress) {
        ctx.save();
        ctx.globalAlpha = 0.8 * (1 - progress);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(anim.target.x, anim.target.y - 20, 10 + i * 15 * progress, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
    
    // 渲染连击动画
    renderComboAnimation(ctx, anim, progress) {
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${anim.count}x COMBO!`, anim.x, anim.y - progress * 30);
        ctx.restore();
    }
    
    // 渲染粒子
    renderParticle(ctx, particle) {
        ctx.save();
        ctx.globalAlpha = particle.life;
        
        if (particle.type === 'damage_number') {
            ctx.fillStyle = particle.color;
            ctx.font = `bold ${16 * particle.scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(particle.text, particle.x, particle.y);
        } else {
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * particle.scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // 渲染击中效果
    renderHitEffect(ctx, effect) {
        const progress = effect.elapsed / effect.duration;
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3 * (1 - progress * 0.5);
        ctx.beginPath();
        ctx.arc(effect.target.x, effect.target.y, 20 * effect.scale * progress, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    
    // 渲染连击
    renderCombo(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText(`${this.combo.count}x COMBO`, this.combo.x, this.combo.y);
        ctx.fillText(`${this.combo.count}x COMBO`, this.combo.x, this.combo.y);
        ctx.restore();
    }
}
