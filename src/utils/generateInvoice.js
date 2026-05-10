import PDFDocument from "pdfkit"

function generateInvoicePDF(order,user){
    return new Promise((resolve,reject)=>{
        const doc= new PDFDocument({margin: 50});
        const chunks=[];


        doc.on("data",(chunk)=> chunks.push(chunk))
        doc.on("end",()=> resolve(Buffer.concat(chunks)))
        doc.on("error",reject)


        doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("ShopSphere", { align: "center" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#888")
      .text("Your one-stop online store", { align: "center" });

    doc.moveDown();
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor("#ccc")
      .stroke();
    doc.moveDown();

    // ── INVOICE TITLE ──
    doc
      .fontSize(16)
      .fillColor("#000")
      .font("Helvetica-Bold")
      .text("INVOICE", { align: "left" });

    doc.moveDown(0.5);

    // ── ORDER INFO ──
    const infoTop = doc.y;
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#333")
      .text(`Order ID:`, 50, infoTop)
      .font("Helvetica-Bold")
      .text(`#${String(order.id).padStart(8, '0').toUpperCase()}`, 150, infoTop);
    doc
      .font("Helvetica")
      .text(`Date:`, 50, infoTop + 18)
      .font("Helvetica-Bold")
      .text(new Date(order.createdAt).toDateString(), 150, infoTop + 18);

    doc
      .font("Helvetica")
      .text(`Payment:`, 50, infoTop + 36)
      .font("Helvetica-Bold")
      .text(order.paymentMethod?.toUpperCase(), 150, infoTop + 36);

    const deliveryDate = new Date(order.createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    doc
      .font("Helvetica")
      .text(`Est. Delivery:`, 50, infoTop + 54)
      .font("Helvetica-Bold")
      .text(deliveryDate.toDateString(), 150, infoTop + 54);

    // ── CUSTOMER INFO ──
    doc
      .font("Helvetica")
      .text(`Customer:`, 300, infoTop)
      .font("Helvetica-Bold")
      .text(user.name || "Customer", 390, infoTop);

    doc
      .font("Helvetica")
      .text(`Email:`, 300, infoTop + 18)
      .font("Helvetica-Bold")
      .text(user.email, 390, infoTop + 18);

    doc.moveDown(5);

    // ── ITEMS TABLE HEADER ──
    const tableTop = doc.y + 10;
    doc
      .rect(50, tableTop, 500, 22)
      .fill("#f0f0f0");

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text("Item", 60, tableTop + 6)
      .text("Qty", 330, tableTop + 6)
      .text("Price", 390, tableTop + 6)
      .text("Total", 470, tableTop + 6);

    // ── ITEMS ROWS ──
    let rowY = tableTop + 28;
    order.items?.forEach((item, i) => {
      const rowColor = i % 2 === 0 ? "#fff" : "#fafafa";
      doc.rect(50, rowY - 4, 500, 20).fill(rowColor);

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#333")
        .text(item.name || item.productId?.name || "Product", 60, rowY, { width: 260 })
        .text(item.quantity?.toString(), 330, rowY)
        .text(`Rs.${item.price?.toFixed(2)}`, 390, rowY)
        .text(`Rs.${(item.price * item.quantity)?.toFixed(2)}`, 470, rowY);

      rowY += 24;
    });

    // ── TOTAL ──
    doc
      .moveTo(50, rowY + 4)
      .lineTo(550, rowY + 4)
      .strokeColor("#ccc")
      .stroke();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text("Total Amount:", 370, rowY + 14)
      .text(`Rs.${order.total?.toFixed(2)}`, 470, rowY + 14);

    // ── FOOTER ──
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#aaa")
      .text("Thank you for shopping with ShopSphere!", 50, rowY + 60, {
        align: "center",
        width: 500,
      });

    doc.end();
  });
};

export default generateInvoicePDF;