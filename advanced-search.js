// Advanced Search and Filtering System
// Provides comprehensive search capabilities across all data

class AdvancedSearchSystem {
    constructor() {
        this.searchIndex = new Map();
        this.filters = {
            dateRange: { start: null, end: null },
            status: 'all',
            location: '',
            user: '',
            type: 'all'
        };
        this.searchResults = [];
        this.currentQuery = '';
        this.init();
    }

    init() {
        this.setupSearchControls();
        this.buildSearchIndex();
        this.setupAdvancedFilters();
    }

    setupSearchControls() {
        const globalSearch = document.getElementById('globalSearch');
        const searchFilterBtn = document.getElementById('searchFilterBtn');
        
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.performGlobalSearch(e.target.value);
            });
            
            globalSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performGlobalSearch(e.target.value);
                }
            });
        }
        
        if (searchFilterBtn) {
            searchFilterBtn.addEventListener('click', () => {
                this.showAdvancedSearchModal();
            });
        }
    }

    buildSearchIndex() {
        // Index access history
        const accessHistory = JSON.parse(localStorage.getItem('accessHistory') || '[]');
        accessHistory.forEach(entry => {
            this.addToSearchIndex('access_history', entry);
        });
        
        // Index user data
        const userData = JSON.parse(localStorage.getItem('userSession') || '{}');
        if (userData.user) {
            this.addToSearchIndex('user_profile', userData.user);
        }
        
        // Index notifications
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.forEach(notification => {
            this.addToSearchIndex('notification', notification);
        });
        
        // Index security log
        const securityLog = JSON.parse(localStorage.getItem('securityLog') || '[]');
        securityLog.forEach(entry => {
            this.addToSearchIndex('security_log', entry);
        });
    }

    addToSearchIndex(type, data) {
        const searchableText = this.extractSearchableText(data);
        const index = {
            type: type,
            data: data,
            searchText: searchableText.toLowerCase(),
            keywords: this.extractKeywords(searchableText)
        };
        
        const id = data.id || data.timestamp || Date.now();
        this.searchIndex.set(id, index);
    }

    extractSearchableText(data) {
        let text = '';
        
        if (typeof data === 'string') {
            text = data;
        } else if (typeof data === 'object') {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const value = data[key];
                    if (typeof value === 'string' || typeof value === 'number') {
                        text += ` ${value}`;
                    }
                }
            }
        }
        
        return text.trim();
    }

    extractKeywords(text) {
        // Remove common words and extract meaningful keywords
        const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
        
        return text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !commonWords.includes(word))
            .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
    }

    performGlobalSearch(query) {
        this.currentQuery = query.trim().toLowerCase();
        
        if (this.currentQuery.length < 2) {
            this.clearSearchResults();
            return;
        }
        
        this.searchResults = [];
        
        for (const [id, index] of this.searchIndex) {
            const score = this.calculateRelevanceScore(index, this.currentQuery);
            if (score > 0) {
                this.searchResults.push({
                    ...index,
                    id: id,
                    score: score
                });
            }
        }
        
        // Sort by relevance score
        this.searchResults.sort((a, b) => b.score - a.score);
        
        this.displaySearchResults();
        this.highlightSearchTerms();
    }

    calculateRelevanceScore(index, query) {
        let score = 0;
        const queryWords = query.split(/\s+/);
        
        queryWords.forEach(word => {
            // Exact match in search text
            if (index.searchText.includes(word)) {
                score += 10;
                
                // Bonus for exact phrase match
                if (index.searchText.includes(query)) {
                    score += 20;
                }
            }
            
            // Keyword match
            if (index.keywords.some(keyword => keyword.includes(word))) {
                score += 5;
            }
            
            // Partial match
            if (index.keywords.some(keyword => keyword.startsWith(word))) {
                score += 3;
            }
        });
        
        // Type-specific bonuses
        if (index.type === 'access_history' && query.includes('access')) {
            score += 5;
        }
        if (index.type === 'notification' && query.includes('notification')) {
            score += 5;
        }
        
        return score;
    }

    displaySearchResults() {
        if (this.searchResults.length === 0) {
            this.showNoResults();
            return;
        }
        
        // Create or update search results panel
        let resultsPanel = document.getElementById('searchResultsPanel');
        if (!resultsPanel) {
            resultsPanel = this.createSearchResultsPanel();
        }
        
        const resultsHtml = this.searchResults.slice(0, 10).map(result => 
            this.renderSearchResult(result)
        ).join('');
        
        resultsPanel.innerHTML = `
            <div class="search-results-header">
                <h4>Search Results for "${this.currentQuery}" (${this.searchResults.length})</h4>
                <button class="close-search" onclick="advancedSearchSystem.clearSearchResults()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results-list">
                ${resultsHtml}
            </div>
        `;
        
        resultsPanel.classList.add('active');
    }

    renderSearchResult(result) {
        const icon = this.getTypeIcon(result.type);
        const timestamp = result.data.timestamp ? new Date(result.data.timestamp).toLocaleString() : '';
        const preview = this.getResultPreview(result);
        
        return `
            <div class="search-result-item" onclick="advancedSearchSystem.selectSearchResult('${result.id}')">
                <div class="result-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${this.getResultTitle(result)}</div>
                    <div class="result-preview">${preview}</div>
                    <div class="result-meta">
                        <span class="result-type">${this.formatType(result.type)}</span>
                        ${timestamp ? `<span class="result-time">${timestamp}</span>` : ''}
                        <span class="result-score">Relevance: ${result.score}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    getTypeIcon(type) {
        const icons = {
            'access_history': 'fa-history',
            'user_profile': 'fa-user',
            'notification': 'fa-bell',
            'security_log': 'fa-shield-alt'
        };
        return icons[type] || 'fa-file';
    }

    getResultTitle(result) {
        switch (result.type) {
            case 'access_history':
                return `Access ${result.data.status === 'success' ? 'Granted' : 'Denied'}`;
            case 'user_profile':
                return `User Profile: ${result.data.firstName} ${result.data.lastName}`;
            case 'notification':
                return result.data.title || 'Notification';
            case 'security_log':
                return `Security Event: ${result.data.type}`;
            default:
                return 'Search Result';
        }
    }

    getResultPreview(result) {
        const text = result.searchText;
        const query = this.currentQuery;
        
        // Find the position of the query in the text
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) {
            return text.substring(0, 100) + (text.length > 100 ? '...' : '');
        }
        
        // Extract context around the match
        const start = Math.max(0, index - 30);
        const end = Math.min(text.length, index + query.length + 30);
        let preview = text.substring(start, end);
        
        if (start > 0) preview = '...' + preview;
        if (end < text.length) preview = preview + '...';
        
        // Highlight the matched query
        const regex = new RegExp(`(${query})`, 'gi');
        preview = preview.replace(regex, '<mark>$1</mark>');
        
        return preview;
    }

    formatType(type) {
        const formatted = {
            'access_history': 'Access History',
            'user_profile': 'User Profile',
            'notification': 'Notification',
            'security_log': 'Security Log'
        };
        return formatted[type] || type;
    }

    createSearchResultsPanel() {
        const panel = document.createElement('div');
        panel.id = 'searchResultsPanel';
        panel.className = 'search-results-panel';
        document.body.appendChild(panel);
        return panel;
    }

    selectSearchResult(id) {
        const result = this.searchResults.find(r => r.id == id);
        if (!result) return;
        
        // Navigate to appropriate section based on result type
        switch (result.type) {
            case 'access_history':
                this.navigateToHistory(result.data);
                break;
            case 'user_profile':
                this.navigateToProfile();
                break;
            case 'notification':
                this.showNotificationDetails(result.data);
                break;
            case 'security_log':
                this.showSecurityLogDetails(result.data);
                break;
        }
        
        this.clearSearchResults();
    }

    navigateToHistory(accessData) {
        // Navigate to history section and highlight the specific entry
        if (window.userPortal) {
            window.userPortal.showSection('history');
            // Scroll to specific entry if possible
            setTimeout(() => {
                const timestamp = new Date(accessData.timestamp).getTime();
                const row = document.querySelector(`[data-timestamp="${timestamp}"]`);
                if (row) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.classList.add('highlighted');
                    setTimeout(() => row.classList.remove('highlighted'), 3000);
                }
            }, 500);
        }
    }

    navigateToProfile() {
        if (window.userPortal) {
            window.userPortal.showSection('profile');
        }
    }

    showNotificationDetails(notification) {
        alert(`Notification Details:

Title: ${notification.title}
Message: ${notification.message}
Time: ${notification.time}`);
    }

    showSecurityLogDetails(logEntry) {
        alert(`Security Log Details:

Type: ${logEntry.type}
Timestamp: ${logEntry.timestamp}
Details: ${JSON.stringify(logEntry, null, 2)}`);
    }

    clearSearchResults() {
        const resultsPanel = document.getElementById('searchResultsPanel');
        if (resultsPanel) {
            resultsPanel.classList.remove('active');
            setTimeout(() => {
                if (resultsPanel.parentNode) {
                    resultsPanel.parentNode.removeChild(resultsPanel);
                }
            }, 300);
        }
        
        this.searchResults = [];
        this.currentQuery = '';
        
        // Clear search input
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    showNoResults() {
        let resultsPanel = document.getElementById('searchResultsPanel');
        if (!resultsPanel) {
            resultsPanel = this.createSearchResultsPanel();
        }
        
        resultsPanel.innerHTML = `
            <div class="search-results-header">
                <h4>No Results Found</h4>
                <button class="close-search" onclick="advancedSearchSystem.clearSearchResults()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No results found for "${this.currentQuery}"</p>
                <p>Try different keywords or use advanced filters</p>
            </div>
        `;
        
        resultsPanel.classList.add('active');
    }

    highlightSearchTerms() {
        // Highlight search terms in visible content
        if (!this.currentQuery) return;
        
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            if (node.nodeValue.toLowerCase().includes(this.currentQuery)) {
                textNodes.push(node);
            }
        }
        
        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
            
            const regex = new RegExp(`(${this.currentQuery})`, 'gi');
            const highlighted = textNode.nodeValue.replace(regex, '<mark class="search-highlight">$1</mark>');
            
            if (highlighted !== textNode.nodeValue) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlighted;
                parent.insertBefore(wrapper, textNode);
                parent.removeChild(textNode);
            }
        });
    }

    // Advanced Search Modal
    showAdvancedSearchModal() {
        const modal = document.getElementById('advancedSearchModal');
        if (modal) {
            modal.classList.add('active');
            this.populateAdvancedSearchForm();
        }
    }

    populateAdvancedSearchForm() {
        // Set current filter values in the form
        const form = document.getElementById('advancedSearchForm');
        if (!form) return;
        
        form.searchDateFrom.value = this.filters.dateRange.start || '';
        form.searchDateTo.value = this.filters.dateRange.end || '';
        form.searchStatus.value = this.filters.status;
        form.searchLocation.value = this.filters.location;
        form.searchUser.value = this.filters.user;
    }

    setupAdvancedFilters() {
        const form = document.getElementById('advancedSearchForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performAdvancedSearch();
            });
        }
        
        const clearBtn = document.getElementById('clearAdvancedSearch');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAdvancedSearch());
        }
        
        const cancelBtn = document.getElementById('cancelAdvancedSearch');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideAdvancedSearchModal());
        }
    }

    performAdvancedSearch() {
        const form = document.getElementById('advancedSearchForm');
        if (!form) return;
        
        // Update filters
        this.filters = {
            dateRange: {
                start: form.searchDateFrom.value,
                end: form.searchDateTo.value
            },
            status: form.searchStatus.value,
            location: form.searchLocation.value,
            user: form.searchUser.value
        };
        
        // Perform filtered search
        this.searchResults = [];
        
        for (const [id, index] of this.searchIndex) {
            if (this.matchesAdvancedFilters(index)) {
                this.searchResults.push({
                    ...index,
                    id: id,
                    score: 100 // All filtered results get same score
                });
            }
        }
        
        this.displaySearchResults();
        this.hideAdvancedSearchModal();
    }

    matchesAdvancedFilters(index) {
        const data = index.data;
        
        // Date range filter
        if (this.filters.dateRange.start || this.filters.dateRange.end) {
            const itemDate = new Date(data.timestamp);
            if (this.filters.dateRange.start && itemDate < new Date(this.filters.dateRange.start)) {
                return false;
            }
            if (this.filters.dateRange.end && itemDate > new Date(this.filters.dateRange.end)) {
                return false;
            }
        }
        
        // Status filter
        if (this.filters.status !== 'all' && data.status !== this.filters.status) {
            return false;
        }
        
        // Location filter
        if (this.filters.location && !data.location?.toLowerCase().includes(this.filters.location.toLowerCase())) {
            return false;
        }
        
        // User filter
        if (this.filters.user && !index.searchText.toLowerCase().includes(this.filters.user.toLowerCase())) {
            return false;
        }
        
        return true;
    }

    clearAdvancedSearch() {
        this.filters = {
            dateRange: { start: null, end: null },
            status: 'all',
            location: '',
            user: '',
            type: 'all'
        };
        
        const form = document.getElementById('advancedSearchForm');
        if (form) {
            form.reset();
        }
    }

    hideAdvancedSearchModal() {
        const modal = document.getElementById('advancedSearchModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// Initialize advanced search system
window.advancedSearchSystem = new AdvancedSearchSystem();