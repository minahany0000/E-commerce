import fs from "fs";
import PDFDocument from "pdfkit";

export function createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc
        .image("logo.png", 15, 15, { width: 150 })
        .fillColor("#444444")
        .fontSize(10)
        .text("Bulkify.", 200, 50, { align: "right" })
        .text("Online store", 200, 65, { align: "right" })
        .text("Cairo Egypt", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);
    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(1, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.totalPrice),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.address, 300, customerInformationTop + 15)
        .text(
            invoice.state +
            ", " +
            invoice.city +
            ", " +
            invoice.street,
            300,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "",
        "Unit Cost",
        "Quantity",
        "Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
    let total = 0;
    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        console.log(item)
        total += (item.finalPrice * item.quantity)
        generateTableRow(
            doc,
            position,
            item.title,
            item.description,
            formatCurrency(item.finalPrice),
            item.quantity,
            formatCurrency(item.finalPrice * item.quantity)
        );
        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(total)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Paid To Date",
        "",
        formatCurrency(0)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Balance Due",
        "",
        formatCurrency(total)
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days. Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "$" + (cents / 1.0).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}
