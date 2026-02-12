// 战斗引擎核心类 - 模仿《For The King》风格的多格概率判定系统
class BattleEngine {
    constructor() {
        this.weapons = [
            {
                name: "短剑",
                slots: 3,
                base_damage: 10,
                special_effect: "快速攻击"
            },
            {
                name: "长剑",
                slots: 4,
                base_damage: 15,
                special_effect: "重击"
            },
            {
                name: "战斧",
                slots: 5,
                base_damage: 20,
                special_effect: "狂暴"
            }
        ];
        this.currentWeapon = this.weapons[0];
    }

    // 执行攻击检定
    performAttack(accuracy, luck = 0, useLuck = false) {
        const slots = this.currentWeapon.slots;
        const results = [];
        let successCount = 0;

        // 对每个slot进行独立检定
        for (let i = 0; i < slots; i++) {
            let success;
            
            if (useLuck && i === 0 && luck > 0) {
                // 消耗运气值，确保第一个slot成功
                success = true;
                luck--;
            } else {
                // 正常概率检定
                success = Math.random() < accuracy;
            }

            results.push({
                slot: i + 1,
                success: success,
                forced: useLuck && i === 0 && success
            });

            if (success) successCount++;
        }

        // 计算伤害
        const successRate = successCount / slots;
        let damage = this.currentWeapon.base_damage * successRate;
        let isPerfect = false;
        let specialTriggered = false;

        // 完美触发判定
        if (successRate === 1) {
            damage *= 1.2; // 伤害加成20%
            isPerfect = true;
            specialTriggered = true;
        }

        return {
            weapon: this.currentWeapon,
            slot_results: results,
            success_count: successCount,
            total_slots: slots,
            success_rate: successRate,
            damage: Math.round(damage),
            is_perfect: isPerfect,
            special_triggered: specialTriggered,
            luck_used: useLuck ? 1 : 0
        };
    }

    // 获取当前武器
    getCurrentWeapon() {
        return this.currentWeapon;
    }

    // 切换武器
    switchWeapon(weaponIndex) {
        if (weaponIndex >= 0 && weaponIndex < this.weapons.length) {
            this.currentWeapon = this.weapons[weaponIndex];
            return true;
        }
        return false;
    }

    // 获取所有武器
    getWeapons() {
        return this.weapons;
    }
}
