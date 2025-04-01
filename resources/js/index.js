import Treeselect from 'treeselectjs'

export default function selectTree({
    state,
    name,
    options,
    searchable,
    showCount,
    placeholder,
    rtl,
    disabledBranchNode = true,
    disabled = false,
    isSingleSelect = true,
    showTags = true,
    clearable = true,
    isIndependentNodes = true,
    alwaysOpen = false,
    emptyText,
    expandSelected = true,
    grouped = true,
    openLevel = 0,
    direction = 'auto'
}) {
    return {
        state,

        /** @type Treeselect */
        tree: null,

        init() {
            this.tree = new Treeselect({
                id: `tree-${name}-id`,
                ariaLabel: `tree-${name}-label`,
                parentHtmlContainer: this.$refs.tree,
                value: this.state,
                options,
                searchable,
                showCount,
                placeholder,
                disabledBranchNode,
                disabled,
                isSingleSelect,
                showTags,
                clearable,
                isIndependentNodes,
                alwaysOpen,
                emptyText,
                expandSelected,
                grouped,
                openLevel,
                direction,
                rtl
            });

            this.tree.srcElement.addEventListener('input', (e) => {
                this.state = e.detail;
                
                // When value changes, ensure parent nodes are expanded
                if (this.state) {
                    setTimeout(() => this.ensureSelectedExpanded(), 10);
                }
            });
            
            // Initial expansion for pre-selected values
            if (this.state) {
                setTimeout(() => this.ensureSelectedExpanded(), 100);
            }
        },
        
        ensureSelectedExpanded() {
            // Don't proceed if tree isn't initialized
            if (!this.tree) {
                return;
            }
            
            const attemptExpansion = (delay, attempt = 1, maxAttempts = 3) => {
                setTimeout(() => {
                    try {
                        const values = Array.isArray(this.state) ? this.state : [this.state];
                        
                        values.forEach(value => {
                            // Skip if value isn't a hierarchical path
                            if (!value || typeof value !== 'string' || !value.includes('.')) {
                                return;
                            }
                            
                            // Split hierarchical path to identify parent nodes
                            const parts = value.split('.');
                            let currentPath = '';
                            
                            // Expand each parent level
                            for (let i = 0; i < parts.length - 1; i++) {
                                currentPath = currentPath ? `${currentPath}.${parts[i]}` : parts[i];
                                
                                // Find and click the expand button for this parent
                                const nodeEl = this.tree.srcElement.querySelector(`[data-treeselectjs-value="${currentPath}"]`);
                                
                                if (nodeEl) {
                                    const expandBtn = nodeEl.querySelector('.treeselectjs-node-icon-expand');
                                    if (expandBtn && expandBtn.style.transform !== 'rotate(90deg)') {
                                        expandBtn.click();
                                    }
                                }
                            }
                        });
                    } catch (error) {
                        if (attempt < maxAttempts) {
                            // Try again with increased delay if DOM might not be ready
                            attemptExpansion(delay * 2, attempt + 1, maxAttempts);
                        } else {
                            console.warn('TreeSelect: Failed to auto-expand parent nodes', error);
                        }
                    }
                }, delay);
            };
            
            // Start with a short delay and try multiple times if needed
            attemptExpansion(50);
            
            // For elements in hidden tabs/modals that might become visible later
            if (typeof MutationObserver !== 'undefined' && this.tree.srcElement) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            (mutation.attributeName === 'style' || mutation.attributeName === 'class') &&
                            window.getComputedStyle(this.tree.srcElement).display !== 'none') {
                            attemptExpansion(50);
                        }
                    });
                });
                
                observer.observe(this.tree.srcElement, { 
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
                
                // Clean up after a reasonable time
                setTimeout(() => observer.disconnect(), 10000);
            }
        }
    }
}
