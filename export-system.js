// Export System for IoT Door Access System
// Supports PDF, Excel, and CSV export formats with professional formatting

class ExportSystem {
    constructor() {
        this.exportQueue = [];
        this.isExporting = false;
        this.supportedFormats = ['pdf', 'excel', 'csv'];
        this.init();
    }

    init() {
        this.setupExportControls();
        this.loadExternalLibraries();
    }

    setupExportControls() {
        // Setup export dropdown
        const exportBtn = document.getElementById('exportBtn');
        const exportMenu = document.getElementById('exportMenu');
        
        if (exportBtn && exportMenu) {
            exportBtn.addEventListener('click', () => {
                exportMenu.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!exportBtn.contains(e.target) && !exportMenu.contains(e.target)) {
                    exportMenu.classList.remove('active');
                }
            });
        }
        
        // Setup export option buttons
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.exportData(format);
                exportMenu.classList.remove('active');
            });
        });
    }

    async loadExternalLibraries() {
        // Load jsPDF for PDF generation
        if (!window.jsPDF) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        
        // Load autoTable plugin for PDF tables
        if (!window.jsPDF?.API?.autoTable) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js');
        }
        
        // Load SheetJS for Excel generation
        if (!window.XLSX) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async exportData(format, dataType = 'history') {
        if (this.isExporting) {
            this.showNotification('Export already in progress', 'warning');
            return;
        }

        this.isExporting = true;
        this.showExportProgress();

        try {
            const data = this.prepareDataForExport(dataType);
            
            switch (format) {
                case 'pdf':
                    await this.exportToPDF(data, dataType);
                    break;
                case 'excel':
                    await this.exportToExcel(data, dataType);
                    break;
                case 'csv':
                    await this.exportToCSV(data, dataType);
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            
            this.showNotification(`Successfully exported ${dataType} as ${format.toUpperCase()}`, 'success');
            
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification(`Export failed: ${error.message}`, 'error');
        } finally {
            this.isExporting = false;
            this.hideExportProgress();
        }
    }

    prepareDataForExport(dataType) {
        const currentUser = this.getCurrentUser();
        const now = new Date();
        
        let data = [];
        let headers = [];
        let title = '';
        
        switch (dataType) {
            case 'history':
                data = this.getAccessHistoryData();
                headers = ['Date', 'Time', 'Status', 'Location', 'Confidence', 'User', 'Details'];
                title = 'Access History Report';
                break;
                
            case 'security':
                data = this.getSecurityLogData();
                headers = ['Timestamp', 'Event Type', 'User', 'IP Address', 'Details', 'Severity'];
                title = 'Security Log Report';
                break;
                
            case 'profile':
                data = this.getUserProfileData();
                headers = ['Field', 'Value'];
                title = 'User Profile Report';
                break;
                
            case 'notifications':
                data = this.getNotificationsData();
                headers = ['Date', 'Title', 'Message', 'Status', 'Type'];
                title = 'Notifications Report';
                break;
        }
        
        return {
            data: data,
            headers: headers,
            title: title,
            metadata: {
                generatedBy: currentUser?.name || 'Unknown User',
                generatedAt: now.toISOString(),
                system: 'IoT Door Access System',
                version: '1.0.0'
            }
        };
    }

    getAccessHistoryData() {
        const history = JSON.parse(localStorage.getItem('accessHistory') || '[]');
        return history.map(entry => [
            new Date(entry.timestamp).toLocaleDateString(),
            new Date(entry.timestamp).toLocaleTimeString(),
            entry.status === 'success' ? 'Success' : 'Failed',
            entry.location || 'Unknown',
            entry.confidence ? `${entry.confidence}%` : 'N/A',
            entry.userName || 'Unknown',
            entry.reason || 'Access attempt'
        ]);
    }

    getSecurityLogData() {
        const securityLog = JSON.parse(localStorage.getItem('securityLog') || '[]');
        return securityLog.map(entry => [
            new Date(entry.timestamp).toLocaleString(),
            entry.type || 'Unknown',
            entry.email || entry.userId || 'Unknown',
            entry.ipAddress || 'Unknown',
            this.formatSecurityDetails(entry),
            entry.severity || 'Normal'
        ]);
    }

    getUserProfileData() {
        const userData = this.getCurrentUser();
        if (!userData) return [];
        
        return [
            ['Full Name', `${userData.firstName || ''} ${userData.lastName || ''}`.trim()],
            ['Email', userData.email || 'Not provided'],
            ['Phone', userData.phone || 'Not provided'],
            ['Department', userData.department || 'Not provided'],
            ['Employee ID', userData.employeeId || 'Not assigned'],
            ['Registration Date', userData.registrationDate || 'Unknown'],
            ['Last Login', userData.lastLogin || 'Unknown'],
            ['Access Level', userData.accessLevel || 'Standard'],
            ['Status', userData.status || 'Active']
        ];
    }

    getNotificationsData() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        return notifications.map(notification => [
            notification.time || 'Unknown',
            notification.title || 'No title',
            notification.message || 'No message',
            notification.read ? 'Read' : 'Unread',
            notification.type || 'General'
        ]);
    }

    formatSecurityDetails(entry) {
        const details = [];
        if (entry.attempts) details.push(`Attempts: ${entry.attempts}`);
        if (entry.reason) details.push(`Reason: ${entry.reason}`);
        if (entry.browserFingerprint) details.push(`Browser: ${entry.browserFingerprint.substr(0, 10)}...`);
        return details.join(', ') || 'Standard security event';
    }

    async exportToPDF(exportData, dataType) {
        if (!window.jsPDF) {
            throw new Error('PDF library not loaded');
        }

        const { jsPDF } = window;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Add header
        this.addPDFHeader(doc, exportData.title, exportData.metadata);
        
        // Add data table
        if (dataType === 'profile') {
            this.addPDFProfileTable(doc, exportData);
        } else {
            this.addPDFDataTable(doc, exportData);
        }
        
        // Add footer
        this.addPDFFooter(doc);
        
        // Save the PDF
        const filename = this.generateFilename(dataType, 'pdf');
        doc.save(filename);
    }

    addPDFHeader(doc, title, metadata) {
        // Logo and company info
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('🚪 IoT Door Access System', 20, 25);
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text(title, 20, 35);
        
        // Metadata
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated by: ${metadata.generatedBy}`, 20, 50);
        doc.text(`Generated at: ${new Date(metadata.generatedAt).toLocaleString()}`, 20, 55);
        doc.text(`System Version: ${metadata.version}`, 20, 60);
        
        // Line separator
        doc.setDrawColor(200);
        doc.line(20, 65, 190, 65);
        
        doc.setTextColor(0); // Reset color
    }

    addPDFDataTable(doc, exportData) {
        doc.autoTable({
            startY: 75,
            head: [exportData.headers],
            body: exportData.data,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [67, 99, 235],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 25 }, // Date
                1: { cellWidth: 20 }, // Time/Status
                2: { cellWidth: 20 }, // Status/Type
                3: { cellWidth: 30 }, // Location/Details
                4: { cellWidth: 20 }, // Confidence/etc
                5: { cellWidth: 25 }, // User
                6: { cellWidth: 40 }  // Details
            }
        });
    }

    addPDFProfileTable(doc, exportData) {
        doc.autoTable({
            startY: 75,
            body: exportData.data,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5,
            },
            columnStyles: {
                0: { 
                    cellWidth: 50,
                    fontStyle: 'bold',
                    fillColor: [248, 250, 252]
                },
                1: { cellWidth: 120 }
            }
        });
    }

    addPDFFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, 20, 285);
            doc.text('Confidential - IoT Door Access System', 190, 285, { align: 'right' });
        }
    }

    async exportToExcel(exportData, dataType) {
        if (!window.XLSX) {
            throw new Error('Excel library not loaded');
        }

        const workbook = XLSX.utils.book_new();
        
        // Create main data worksheet
        const worksheet = this.createExcelWorksheet(exportData, dataType);
        XLSX.utils.book_append_sheet(workbook, worksheet, dataType.charAt(0).toUpperCase() + dataType.slice(1));
        
        // Add metadata worksheet
        const metadataSheet = this.createMetadataWorksheet(exportData.metadata);
        XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
        
        // Generate and save file
        const filename = this.generateFilename(dataType, 'xlsx');
        XLSX.writeFile(workbook, filename);
    }

    createExcelWorksheet(exportData, dataType) {
        let data;
        
        if (dataType === 'profile') {
            // For profile data, don't include headers row
            data = exportData.data;
        } else {
            // For other data types, include headers
            data = [exportData.headers, ...exportData.data];
        }
        
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        
        // Set column widths
        const columnWidths = dataType === 'profile' 
            ? [{ wch: 20 }, { wch: 40 }]
            : [{ wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 20 }, { wch: 30 }];
        
        worksheet['!cols'] = columnWidths;
        
        // Apply styles to header row (if not profile)
        if (dataType !== 'profile') {
            const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
            for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        font: { bold: true, color: { rgb: 'FFFFFF' } },
                        fill: { fgColor: { rgb: '4F46E5' } },
                        alignment: { horizontal: 'center' }
                    };
                }
            }
        }
        
        return worksheet;
    }

    createMetadataWorksheet(metadata) {
        const metadataArray = [
            ['Property', 'Value'],
            ['System', metadata.system],
            ['Version', metadata.version],
            ['Generated By', metadata.generatedBy],
            ['Generated At', new Date(metadata.generatedAt).toLocaleString()],
            ['Export Format', 'Microsoft Excel'],
            ['Total Records', 'See main sheet']
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(metadataArray);
        worksheet['!cols'] = [{ wch: 20 }, { wch: 40 }];
        
        return worksheet;
    }

    async exportToCSV(exportData, dataType) {
        let csvContent = '';
        
        // Add metadata as comments
        csvContent += `# ${exportData.title}\n`;
        csvContent += `# Generated by: ${exportData.metadata.generatedBy}\n`;
        csvContent += `# Generated at: ${new Date(exportData.metadata.generatedAt).toLocaleString()}\n`;
        csvContent += `# System: ${exportData.metadata.system} v${exportData.metadata.version}\n`;
        csvContent += `#\n`;
        
        // Add headers (except for profile data)
        if (dataType !== 'profile') {
            csvContent += exportData.headers.map(header => `"${header}"`).join(',') + '\n';
        }
        
        // Add data rows
        exportData.data.forEach(row => {
            const csvRow = row.map(cell => {
                // Escape quotes and wrap in quotes if necessary
                const cellStr = String(cell || '');
                if (cellStr.includes('"') || cellStr.includes(',') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
            }).join(',');
            csvContent += csvRow + '\n';
        });
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const filename = this.generateFilename(dataType, 'csv');
        this.downloadBlob(blob, filename);
    }

    generateFilename(dataType, extension) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        return `door_access_${dataType}_${dateStr}_${timeStr}.${extension}`;
    }

    downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    getCurrentUser() {
        const sessionData = JSON.parse(
            localStorage.getItem('userSession') || 
            sessionStorage.getItem('userSession') || 
            'null'
        );
        return sessionData?.user || null;
    }

    showExportProgress() {
        const progressModal = document.createElement('div');
        progressModal.id = 'exportProgressModal';
        progressModal.className = 'modal export-progress-modal active';
        progressModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-download"></i> Exporting Data</h3>
                </div>
                <div class="modal-body">
                    <div class="export-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <p>Preparing your export... Please wait.</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(progressModal);
        
        // Animate progress bar
        const progressFill = progressModal.querySelector('.progress-fill');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 90) progress = 90;
            progressFill.style.width = progress + '%';
        }, 200);
        
        progressModal.dataset.interval = interval;
    }

    hideExportProgress() {
        const progressModal = document.getElementById('exportProgressModal');
        if (progressModal) {
            // Clear interval
            const interval = progressModal.dataset.interval;
            if (interval) {
                clearInterval(parseInt(interval));
            }
            
            // Complete progress and remove modal
            const progressFill = progressModal.querySelector('.progress-fill');
            progressFill.style.width = '100%';
            
            setTimeout(() => {
                if (progressModal.parentNode) {
                    progressModal.parentNode.removeChild(progressModal);
                }
            }, 500);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : type === 'warning' ? 'fa-exclamation' : 'fa-info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Batch export functionality
    async exportMultiple(formats, dataTypes) {
        for (const format of formats) {
            for (const dataType of dataTypes) {
                await this.exportData(format, dataType);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between exports
            }
        }
    }

    // Scheduled export functionality
    scheduleExport(format, dataType, interval) {
        const exportInterval = setInterval(async () => {
            try {
                await this.exportData(format, dataType);
                this.showNotification(`Scheduled export completed: ${dataType} as ${format}`, 'success');
            } catch (error) {
                this.showNotification(`Scheduled export failed: ${error.message}`, 'error');
            }
        }, interval);
        
        return exportInterval;
    }
}

// Initialize export system
window.exportSystem = new ExportSystem();