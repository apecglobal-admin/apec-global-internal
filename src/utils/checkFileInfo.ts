const getFileInfo = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const fileName = url.split('/').pop() || 'file';
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const isImage = imageExtensions.includes(extension);
    
    const fileIcons: Record<string, string> = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'xls': '📊',
        'xlsx': '📊',
        'ppt': '📊',
        'pptx': '📊',
        'txt': '📃',
        'zip': '🗜️',
        'rar': '🗜️',
    };
    
    return {
        isImage,
        extension: extension.toUpperCase(),
        fileName,
        icon: fileIcons[extension] || '📎'
    };
};

export default getFileInfo