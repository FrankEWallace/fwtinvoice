import { Card, CardContent } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Download, Printer, HelpCircle, Plus, Trash2, FileText, Save, FolderOpen } from "lucide-react";
import { useRef, useState, useEffect } from "react";
// @ts-ignore - html2pdf.js doesn't have proper TypeScript definitions
import html2pdf from "html2pdf.js";
import fwLogo from 'figma:asset/53e8df23191701fe1725bcfb836a0e02eafe59d7.png';
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

interface InvoiceItem {
  id: string;
  description: string;
  details: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientType: string;
  clientLocation: string;
  items: InvoiceItem[];
  taxRate: number;
}

export default function App() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: 'FWT-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: 'Meilleur Trading Group',
    clientType: 'Trading & Commerce',
    clientLocation: 'Dar es Salaam, Tanzania',
    items: [
      {
        id: '1',
        description: 'Website Development & Hosting Services',
        details: 'Complete website development for Meilleur Trading Group including design, development, deployment, and annual hosting services',
        quantity: 1,
        rate: 300000
      }
    ],
    taxRate: 0
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      details: '',
      quantity: 1,
      rate: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} TZS`;
  };

  const resetInvoice = () => {
    if (confirm('Are you sure you want to create a new invoice? All current data will be cleared.')) {
      const nextInvoiceNumber = `FWT-${String(parseInt(invoiceData.invoiceNumber.split('-')[1]) + 1).padStart(3, '0')}`;
      setInvoiceData({
        invoiceNumber: nextInvoiceNumber,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        clientName: '',
        clientType: '',
        clientLocation: '',
        items: [
          {
            id: Date.now().toString(),
            description: '',
            details: '',
            quantity: 1,
            rate: 0
          }
        ],
        taxRate: 0
      });
      setIsEditing(true);
      toast.success('New invoice created', {
        description: `Invoice number: ${nextInvoiceNumber}`
      });
    }
  };

  const saveInvoice = () => {
    try {
      localStorage.setItem('fw_invoice_draft', JSON.stringify(invoiceData));
      setLastSaved(new Date());
      toast.success('Invoice saved!', {
        description: 'Your invoice has been saved to browser storage.'
      });
    } catch (error) {
      toast.error('Failed to save invoice', {
        description: 'Please try again.'
      });
    }
  };

  const loadInvoice = () => {
    try {
      const saved = localStorage.getItem('fw_invoice_draft');
      if (saved) {
        setInvoiceData(JSON.parse(saved));
        toast.success('Invoice loaded!', {
          description: 'Your saved invoice has been restored.'
        });
      } else {
        toast.info('No saved invoice found', {
          description: 'Create and save an invoice first.'
        });
      }
    } catch (error) {
      toast.error('Failed to load invoice', {
        description: 'Please try again.'
      });
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (invoiceData.clientName || invoiceData.items.some(item => item.description)) {
        localStorage.setItem('fw_invoice_draft', JSON.stringify(invoiceData));
        setLastSaved(new Date());
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [invoiceData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveInvoice();
      }
      // Ctrl/Cmd + P to print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printInvoice();
      }
      // Ctrl/Cmd + E to toggle edit mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsEditing(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [invoiceData]);

  const downloadPDF = async () => {
    if (!invoiceRef.current || isGenerating) return;
    
    setIsGenerating(true);
    const wasEditing = isEditing;
    setIsEditing(false); // Hide edit mode during PDF generation
    
    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Generate filename
      const currentDate = new Date().toISOString().split('T')[0];
      const clientNameSafe = (invoiceData.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${invoiceData.invoiceNumber}_Invoice_${clientNameSafe}_${currentDate}.pdf`;
      
      const options = {
        margin: 0.5,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };
      
      // @ts-ignore
      await html2pdf().set(options).from(invoiceRef.current).save();
      
      toast.success('PDF downloaded successfully!', {
        description: `Saved as ${filename}`
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', {
        description: 'Please try using the Print button instead (Ctrl+P)'
      });
    } finally {
      setIsGenerating(false);
      if (wasEditing) {
        setTimeout(() => setIsEditing(true), 100);
      }
    }
  };

  const printInvoice = () => {
    const wasEditing = isEditing;
    setIsEditing(false);
    setTimeout(() => {
      window.print();
      if (wasEditing) setIsEditing(true);
      toast.info('Print dialog opened', {
        description: 'Use your browser\'s print settings to save as PDF or print to paper.'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Header with status */}
        <div className="flex justify-between items-center mb-4 print-hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Invoice Generator</h1>
            {lastSaved && (
              <p className="text-xs text-gray-500 mt-1">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        
        {/* Download Button */}
        <div className="flex justify-between items-center mb-6 print-hidden">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HelpCircle size={16} />
            <span>Fill in details • Auto-saves every 30s • Shortcuts: Ctrl+S (Save), Ctrl+E (Edit), Ctrl+P (Print)</span>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={loadInvoice}
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <FolderOpen size={16} />
              Load
            </Button>
            <Button 
              onClick={saveInvoice}
              variant="outline"
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
            >
              <Save size={16} />
              Save
            </Button>
            <Button 
              onClick={resetInvoice}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <FileText size={16} />
              New Invoice
            </Button>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-gray-300"
            >
              {isEditing ? '👁️ Preview' : '✏️ Edit'}
            </Button>
            <Button 
              onClick={printInvoice}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Printer size={16} />
              Print
            </Button>
            <Button 
              onClick={downloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>
        <div ref={invoiceRef}>
          <Card className="shadow-lg border-0 bg-white invoice-container">
            <CardContent className="p-12 invoice-content">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div className="flex items-center space-x-6">
                <img 
                  src={fwLogo} 
                  alt="F.W Technologies" 
                  className="h-24 w-24 object-contain"
                />
                <div>
                  <h1 className="text-2xl font-light text-black tracking-tight">F.W Technologies</h1>
                  <p className="text-gray-600 mt-1 text-sm">Web Development & Technology Solutions</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-light text-black mb-2">INVOICE</h2>
                <div className="text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Invoice #:</span>{' '}
                    {isEditing ? (
                      <Input 
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        className="inline-block w-24 h-6 px-2 py-1 text-sm align-middle"
                      />
                    ) : invoiceData.invoiceNumber}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {isEditing ? (
                      <Input 
                        type="date"
                        value={invoiceData.date}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                        className="inline-block w-36 h-6 px-2 py-1 text-sm align-middle"
                      />
                    ) : new Date(invoiceData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p>
                    <span className="font-medium">Due Date:</span>{' '}
                    {isEditing ? (
                      <Input 
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="inline-block w-36 h-6 px-2 py-1 text-sm align-middle"
                      />
                    ) : new Date(invoiceData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Company Details */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-lg font-medium text-black mb-4">From</h3>
                <div className="text-gray-700 space-y-2">
                  <p className="font-medium text-black">F.W Technologies</p>
                  <p>Technology Solutions Provider</p>
                  <p>Dar es Salaam, Tanzania</p>
                  <p>wellikana@gmail.com</p>
                  <p>+255 764 357699</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Bill To</h3>
                <div className="text-gray-700 space-y-2">
                  {isEditing ? (
                    <>
                      <Input 
                        value={invoiceData.clientName}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Client Name"
                        className="font-medium text-black mb-2"
                      />
                      <Input 
                        value={invoiceData.clientType}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, clientType: e.target.value }))}
                        placeholder="Business Type"
                        className="mb-2"
                      />
                      <Input 
                        value={invoiceData.clientLocation}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, clientLocation: e.target.value }))}
                        placeholder="Location"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-black">{invoiceData.clientName}</p>
                      <p>{invoiceData.clientType}</p>
                      <p>{invoiceData.clientLocation}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 text-sm font-medium text-gray-700 uppercase tracking-wide">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                <Separator />
                
                {invoiceData.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="grid grid-cols-12 gap-4 p-4 text-gray-800 items-start">
                      <div className="col-span-6">
                        {isEditing ? (
                          <>
                            <Input 
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Service/Product Name"
                              className="font-medium text-black mb-2"
                            />
                            <Textarea 
                              value={item.details}
                              onChange={(e) => updateItem(item.id, 'details', e.target.value)}
                              placeholder="Additional details..."
                              className="text-sm min-h-[60px]"
                            />
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-black">{item.description}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                          </>
                        )}
                      </div>
                      <div className="col-span-2 flex items-start justify-center pt-2">
                        {isEditing ? (
                          <Input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 text-center"
                            min="0"
                            step="1"
                          />
                        ) : <span className="pt-1">{item.quantity}</span>}
                      </div>
                      <div className="col-span-2 flex items-start justify-end pt-2">
                        {isEditing ? (
                          <Input 
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full text-right"
                            min="0"
                            step="1000"
                          />
                        ) : <span className="pt-1">{formatCurrency(item.rate)}</span>}
                      </div>
                      <div className="col-span-2 flex items-start justify-end pt-2">
                        <div className="flex items-center justify-end gap-2 w-full">
                          <span className="flex-grow text-right pt-1">{formatCurrency(item.quantity * item.rate)}</span>
                          {isEditing && invoiceData.items.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 print-hidden h-8 w-8 p-0 flex-shrink-0"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < invoiceData.items.length - 1 && <Separator />}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="p-4 print-hidden border-t">
                    <Button
                      onClick={addItem}
                      variant="outline"
                      className="w-full border-dashed hover:bg-gray-100"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-80">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 items-center gap-2">
                    <span>Tax ({isEditing ? (
                      <Input 
                        type="number"
                        value={invoiceData.taxRate}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="inline-block w-14 h-6 px-2 py-1 text-sm mx-1 text-center"
                        min="0"
                        max="100"
                      />
                    ) : invoiceData.taxRate}%):</span>
                    <span>{formatCurrency(calculateTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-medium text-black">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h3 className="text-lg font-medium text-black mb-4">Payment Information</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><span className="font-medium">Bank:</span> NMB Bank</p>
                    <p><span className="font-medium">Account Name:</span> Frank Wallace</p>
                    <p><span className="font-medium">Account Number:</span> 51010071289</p>
                    <p><span className="font-medium">Currency:</span> Tanzanian Shilling (TZS)</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-4">Terms & Conditions</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Payment is due within 30 days of invoice date</p>
                    <p>• Late payments may incur additional charges</p>
                    <p>• Services include 1 year of hosting and maintenance</p>
                    <p>• Technical support included during business hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Thank you for choosing F.W Technologies for your web development needs.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                This invoice was generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}