// 图鉴系统
class EncyclopediaSystem {
    constructor(equipmentSystem) {
        this.equipmentSystem = equipmentSystem;
        this.discoveredItems = new Set(); // 已发现的装备
        this.loadDiscoveredItems();
    }
    
    // 加载已发现的装备
    loadDiscoveredItems() {
        const saved = localStorage.getItem('encyclopedia_discovered');
        if (saved) {
            this.discoveredItems = new Set(JSON.parse(saved));
        }
    }
    
    // 保存已发现的装备
    saveDiscoveredItems() {
        localStorage.setItem('encyclopedia_discovered', JSON.stringify([...this.discoveredItems]));
    }
    
    // 发现新装备
    discoverItem(itemId) {
        if (!this.discoveredItems.has(itemId)) {
            this.discoveredItems.add(itemId);
            this.saveDiscoveredItems();
            return true; // 新发现
        }
        return false; // 已经发现过
    }
    
    // 获取所有装备的图鉴信息
    getAllEncyclopediaItems() {
        const allEquipment = this.equipmentSystem.getAllEquipment();
        const categories = {
            weapons: [],
            armors: [],
            accessories: []
        };
        
        allEquipment.forEach(item => {
            const encyclopediaItem = {
                ...item,
                discovered: this.discoveredItems.has(item.id),
                rarity: this.equipmentSystem.getQualityName(item.quality),
                quality: item.quality
            };
            
            if (item.type === 'weapon') {
                categories.weapons.push(encyclopediaItem);
            } else if (item.type === 'armor') {
                categories.armors.push(encyclopediaItem);
            } else if (item.type === 'accessory') {
                categories.accessories.push(encyclopediaItem);
            }
        });
        
        // 按品质排序
        const qualityOrder = { white: 0, green: 1, blue: 2, purple: 3 };
        Object.keys(categories).forEach(category => {
            categories[category].sort((a, b) => {
                const qualityDiff = qualityOrder[a.quality] - qualityOrder[b.quality];
                if (qualityDiff !== 0) return qualityDiff;
                return a.name.localeCompare(b.name);
            });
        });
        
        return categories;
    }
    
    // 获取发现统计
    getDiscoveryStats() {
        const allEquipment = this.equipmentSystem.getAllEquipment();
        const totalItems = allEquipment.length;
        const discoveredCount = this.discoveredItems.size;
        const discoveryRate = totalItems > 0 ? (discoveredCount / totalItems * 100).toFixed(1) : 0;
        
        // 按品质统计
        const statsByQuality = {
            white: { total: 0, discovered: 0 },
            green: { total: 0, discovered: 0 },
            blue: { total: 0, discovered: 0 },
            purple: { total: 0, discovered: 0 }
        };
        
        allEquipment.forEach(item => {
            statsByQuality[item.quality].total++;
            if (this.discoveredItems.has(item.id)) {
                statsByQuality[item.quality].discovered++;
            }
        });
        
        return {
            total: totalItems,
            discovered: discoveredCount,
            rate: discoveryRate,
            byQuality: statsByQuality
        };
    }
    
    // 生成图鉴HTML
    generateEncyclopediaHTML() {
        const categories = this.getAllEncyclopediaItems();
        const stats = this.getDiscoveryStats();
        
        let html = `
            <div class="encyclopedia-header">
                <h2>📚 装备图鉴</h2>
                <div class="discovery-stats">
                    <div class="stat-item">
                        <span class="stat-label">总装备:</span>
                        <span class="stat-value">${stats.discovered}/${stats.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">完成度:</span>
                        <span class="stat-value">${stats.rate}%</span>
                    </div>
                </div>
                <div class="quality-stats">
                    <div class="quality-stat white">
                        <span>普通: ${stats.byQuality.white.discovered}/${stats.byQuality.white.total}</span>
                    </div>
                    <div class="quality-stat green">
                        <span>精良: ${stats.byQuality.green.discovered}/${stats.byQuality.green.total}</span>
                    </div>
                    <div class="quality-stat blue">
                        <span>稀有: ${stats.byQuality.blue.discovered}/${stats.byQuality.blue.total}</span>
                    </div>
                    <div class="quality-stat purple">
                        <span>史诗: ${stats.byQuality.purple.discovered}/${stats.byQuality.purple.total}</span>
                    </div>
                </div>
            </div>
            
            <div class="encyclopedia-content">
        `;
        
        // 武器类别
        html += this.generateCategoryHTML('weapons', '⚔️ 武器', categories.weapons);
        
        // 防具类别
        html += this.generateCategoryHTML('armors', '🛡️ 防具', categories.armors);
        
        // 饰品类别
        html += this.generateCategoryHTML('accessories', '💍 饰品', categories.accessories);
        
        html += `
            </div>
        `;
        
        return html;
    }
    
    // 生成类别HTML
    generateCategoryHTML(categoryId, categoryName, items) {
        let html = `
            <div class="encyclopedia-category" id="${categoryId}">
                <h3>${categoryName}</h3>
                <div class="encyclopedia-grid">
        `;
        
        items.forEach(item => {
            const discoveredClass = item.discovered ? 'discovered' : 'undiscovered';
            const itemName = item.discovered ? item.name : '???';
            const itemStats = item.discovered ? this.formatItemStats(item.stats) : '???';
            
            html += `
                <div class="encyclopedia-item ${discoveredClass} quality-${item.quality}">
                    <div class="item-preview">
                        ${item.discovered ? 
                            `<img src="assets/icons/${item.id}.png" alt="${item.name}" class="item-icon" onerror="this.style.display='none'">` :
                            `<div class="item-placeholder">?</div>`
                        }
                    </div>
                    <div class="item-info">
                        <div class="item-name">${itemName}</div>
                        <div class="item-quality">${item.rarity}</div>
                        <div class="item-stats">${itemStats}</div>
                        <div class="item-price">💰 ${item.discovered ? item.price : '???'}</div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    // 格式化装备属性
    formatItemStats(stats) {
        const statNames = {
            maxHealth: '生命',
            attack: '攻击',
            defense: '防御',
            accuracy: '命中',
            luck: '运气'
        };
        
        return Object.entries(stats)
            .map(([stat, value]) => {
                const name = statNames[stat] || stat;
                const displayValue = stat === 'accuracy' ? `${(value * 100).toFixed(0)}%` : `+${value}`;
                return `${name}: ${displayValue}`;
            })
            .join(' | ');
    }
}
