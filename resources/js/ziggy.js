const Ziggy = {"url":"https:\/\/controlefinaceiro.dev.localhost","port":null,"defaults":{},"routes":{"sanctum.csrf-cookie":{"uri":"sanctum\/csrf-cookie","methods":["GET","HEAD"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"profile.edit":{"uri":"profile","methods":["GET","HEAD"]},"profile.update":{"uri":"profile","methods":["PATCH"]},"profile.destroy":{"uri":"profile","methods":["DELETE"]},"clients":{"uri":"clients","methods":["GET","HEAD"]},"clients.create":{"uri":"clients\/create","methods":["GET","HEAD"]},"products.index":{"uri":"products","methods":["GET","HEAD"]},"products.create":{"uri":"products\/create","methods":["GET","HEAD"]},"sales":{"uri":"sales","methods":["GET","HEAD"]},"financial":{"uri":"financial","methods":["GET","HEAD"]},"financial.receivables.index":{"uri":"financial\/receivables","methods":["GET","HEAD"]},"financial.payables.index":{"uri":"financial\/payables","methods":["GET","HEAD"]},"financial.cash-flow":{"uri":"financial\/cash-flow","methods":["GET","HEAD"]},"financial.dre":{"uri":"financial\/dre","methods":["GET","HEAD"]},"financial.bank-reconciliation.index":{"uri":"financial\/bank-reconciliation","methods":["GET","HEAD"]},"financial.cost-center":{"uri":"financial\/cost-center","methods":["GET","HEAD"]},"financial.dashboard":{"uri":"financial\/dashboard","methods":["GET","HEAD"]},"employees.index":{"uri":"employees","methods":["GET","HEAD"]},"logistics":{"uri":"logistics","methods":["GET","HEAD"]},"reports.index":{"uri":"reports","methods":["GET","HEAD"]},"settings.index":{"uri":"settings","methods":["GET","HEAD"]},"customers.index":{"uri":"customers","methods":["GET","HEAD"]},"customers.create":{"uri":"customers\/create","methods":["GET","HEAD"]},"customers.store":{"uri":"customers","methods":["POST"]},"customers.edit":{"uri":"customers\/{customer}\/edit","methods":["GET","HEAD"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.update":{"uri":"customers\/{customer}","methods":["PUT"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.destroy":{"uri":"customers\/{customer}","methods":["DELETE"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.categories.index":{"uri":"customers\/categories","methods":["GET","HEAD"]},"customers.categories.create":{"uri":"customers\/categories\/create","methods":["GET","HEAD"]},"customers.categories.store":{"uri":"customers\/categories","methods":["POST"]},"customers.categories.edit":{"uri":"customers\/categories\/{category}\/edit","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"customers.categories.update":{"uri":"customers\/categories\/{category}","methods":["PUT"],"parameters":["category"],"bindings":{"category":"id"}},"customers.categories.destroy":{"uri":"customers\/categories\/{category}","methods":["DELETE"],"parameters":["category"],"bindings":{"category":"id"}},"customers.history.index":{"uri":"customers\/{customer}\/history","methods":["GET","HEAD"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.history.store":{"uri":"customers\/{customer}\/history","methods":["POST"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.history.destroy":{"uri":"customers\/{customer}\/history\/{history}","methods":["DELETE"],"parameters":["customer","history"],"bindings":{"customer":"id","history":"id"}},"customers.documents.index":{"uri":"customers\/{customer}\/documents","methods":["GET","HEAD"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.documents.store":{"uri":"customers\/{customer}\/documents","methods":["POST"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.documents.destroy":{"uri":"customers\/{customer}\/documents\/{document}","methods":["DELETE"],"parameters":["customer","document"],"bindings":{"customer":"id","document":"id"}},"customers.documents.download":{"uri":"customers\/{customer}\/documents\/{document}\/download","methods":["GET","HEAD"],"parameters":["customer","document"],"bindings":{"customer":"id","document":"id"}},"products.categories.index":{"uri":"products\/categories","methods":["GET","HEAD"]},"products.categories.store":{"uri":"products\/categories","methods":["POST"]},"products.categories.edit":{"uri":"products\/categories\/{category}\/edit","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"products.categories.update":{"uri":"products\/categories\/{category}","methods":["PUT"],"parameters":["category"],"bindings":{"category":"id"}},"products.categories.destroy":{"uri":"products\/categories\/{category}","methods":["DELETE"],"parameters":["category"],"bindings":{"category":"id"}},"products.stock.alerts":{"uri":"products\/stock\/alerts","methods":["GET","HEAD"]},"products.stock.transfer":{"uri":"products\/stock\/transfer","methods":["POST"]},"products.stock.index":{"uri":"products\/{product}\/stock","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"products.stock.adjust":{"uri":"products\/{product}\/stock\/adjust","methods":["POST"],"parameters":["product"],"bindings":{"product":"id"}},"products.stock.history":{"uri":"products\/{product}\/stock\/history","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"logistics.deliveries.index":{"uri":"logistics\/deliveries","methods":["GET","HEAD"]},"logistics.deliveries.create":{"uri":"logistics\/deliveries\/create","methods":["GET","HEAD"]},"logistics.deliveries.store":{"uri":"logistics\/deliveries","methods":["POST"]},"logistics.deliveries.show":{"uri":"logistics\/deliveries\/{delivery}","methods":["GET","HEAD"],"parameters":["delivery"],"bindings":{"delivery":"id"}},"logistics.deliveries.edit":{"uri":"logistics\/deliveries\/{delivery}\/edit","methods":["GET","HEAD"],"parameters":["delivery"],"bindings":{"delivery":"id"}},"logistics.deliveries.update":{"uri":"logistics\/deliveries\/{delivery}","methods":["PUT","PATCH"],"parameters":["delivery"],"bindings":{"delivery":"id"}},"logistics.deliveries.destroy":{"uri":"logistics\/deliveries\/{delivery}","methods":["DELETE"],"parameters":["delivery"],"bindings":{"delivery":"id"}},"logistics.carriers.index":{"uri":"logistics\/carriers","methods":["GET","HEAD"]},"logistics.carriers.create":{"uri":"logistics\/carriers\/create","methods":["GET","HEAD"]},"logistics.carriers.store":{"uri":"logistics\/carriers","methods":["POST"]},"logistics.carriers.show":{"uri":"logistics\/carriers\/{carrier}","methods":["GET","HEAD"],"parameters":["carrier"],"bindings":{"carrier":"id"}},"logistics.carriers.edit":{"uri":"logistics\/carriers\/{carrier}\/edit","methods":["GET","HEAD"],"parameters":["carrier"],"bindings":{"carrier":"id"}},"logistics.carriers.update":{"uri":"logistics\/carriers\/{carrier}","methods":["PUT","PATCH"],"parameters":["carrier"],"bindings":{"carrier":"id"}},"logistics.carriers.destroy":{"uri":"logistics\/carriers\/{carrier}","methods":["DELETE"],"parameters":["carrier"],"bindings":{"carrier":"id"}},"logistics.tracking":{"uri":"logistics\/tracking","methods":["GET","HEAD"]},"products.store":{"uri":"products","methods":["POST"]},"products.show":{"uri":"products\/{product}","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"products.edit":{"uri":"products\/{product}\/edit","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"products.update":{"uri":"products\/{product}","methods":["PUT"],"parameters":["product"],"bindings":{"product":"id"}},"products.destroy":{"uri":"products\/{product}","methods":["DELETE"],"parameters":["product"],"bindings":{"product":"id"}},"products.duplicate":{"uri":"products\/{product}\/duplicate","methods":["POST"],"parameters":["product"]},"products.export":{"uri":"products\/export","methods":["POST"]},"products.variations.index":{"uri":"products\/{product}\/variations","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"products.variations.store":{"uri":"products\/{product}\/variations","methods":["POST"],"parameters":["product"],"bindings":{"product":"id"}},"products.variations.update":{"uri":"products\/{product}\/variations\/{variation}","methods":["PUT"],"parameters":["product","variation"],"bindings":{"product":"id","variation":"id"}},"products.variations.destroy":{"uri":"products\/{product}\/variations\/{variation}","methods":["DELETE"],"parameters":["product","variation"],"bindings":{"product":"id","variation":"id"}},"products.images.destroy":{"uri":"products\/images\/{image}","methods":["DELETE"],"parameters":["image"],"bindings":{"image":"id"}},"products.images.main":{"uri":"products\/images\/{image}\/main","methods":["POST"],"parameters":["image"],"bindings":{"image":"id"}},"products.images.reorder":{"uri":"products\/images\/reorder","methods":["POST"]},"settings.update":{"uri":"settings","methods":["POST"]},"orders.index":{"uri":"orders","methods":["GET","HEAD"]},"orders.create":{"uri":"orders\/create","methods":["GET","HEAD"]},"orders.store":{"uri":"orders","methods":["POST"]},"orders.show":{"uri":"orders\/{order}","methods":["GET","HEAD"],"parameters":["order"],"bindings":{"order":"id"}},"orders.cancel":{"uri":"orders\/{order}\/cancel","methods":["POST"],"parameters":["order"],"bindings":{"order":"id"}},"orders.print":{"uri":"orders\/{order}\/print","methods":["GET","HEAD"],"parameters":["order"],"bindings":{"order":"id"}},"pdv.index":{"uri":"pdv","methods":["GET","HEAD"]},"pdv.store":{"uri":"pdv","methods":["POST"]},"pdv.print":{"uri":"pdv\/print\/{order}","methods":["GET","HEAD"],"parameters":["order"],"bindings":{"order":"id"}},"payments.index":{"uri":"orders\/{order}\/payments","methods":["GET","HEAD"],"parameters":["order"],"bindings":{"order":"id"}},"payments.store":{"uri":"orders\/{order}\/payments","methods":["POST"],"parameters":["order"],"bindings":{"order":"id"}},"payments.update":{"uri":"orders\/{order}\/payments\/{payment}","methods":["PUT"],"parameters":["order","payment"],"bindings":{"order":"id","payment":"id"}},"payments.destroy":{"uri":"orders\/{order}\/payments\/{payment}","methods":["DELETE"],"parameters":["order","payment"],"bindings":{"order":"id","payment":"id"}},"financial.receivables.create":{"uri":"financial\/receivables\/create","methods":["GET","HEAD"]},"financial.receivables.store":{"uri":"financial\/receivables","methods":["POST"]},"financial.receivables.show":{"uri":"financial\/receivables\/{receivable}","methods":["GET","HEAD"],"parameters":["receivable"]},"financial.receivables.edit":{"uri":"financial\/receivables\/{receivable}\/edit","methods":["GET","HEAD"],"parameters":["receivable"],"bindings":{"receivable":"id"}},"financial.receivables.update":{"uri":"financial\/receivables\/{receivable}","methods":["PUT","PATCH"],"parameters":["receivable"],"bindings":{"receivable":"id"}},"financial.receivables.destroy":{"uri":"financial\/receivables\/{receivable}","methods":["DELETE"],"parameters":["receivable"],"bindings":{"receivable":"id"}},"financial.payables.create":{"uri":"financial\/payables\/create","methods":["GET","HEAD"]},"financial.payables.store":{"uri":"financial\/payables","methods":["POST"]},"financial.payables.show":{"uri":"financial\/payables\/{payable}","methods":["GET","HEAD"],"parameters":["payable"]},"financial.payables.edit":{"uri":"financial\/payables\/{payable}\/edit","methods":["GET","HEAD"],"parameters":["payable"],"bindings":{"payable":"id"}},"financial.payables.update":{"uri":"financial\/payables\/{payable}","methods":["PUT","PATCH"],"parameters":["payable"],"bindings":{"payable":"id"}},"financial.payables.destroy":{"uri":"financial\/payables\/{payable}","methods":["DELETE"],"parameters":["payable"],"bindings":{"payable":"id"}},"financial.cash-flow.export":{"uri":"financial\/cash-flow\/export","methods":["GET","HEAD"]},"financial.dre.export":{"uri":"financial\/dre\/export","methods":["GET","HEAD"]},"financial.bank-reconciliation.create":{"uri":"financial\/bank-reconciliation\/create","methods":["GET","HEAD"]},"financial.bank-reconciliation.store":{"uri":"financial\/bank-reconciliation","methods":["POST"]},"financial.bank-reconciliation.show":{"uri":"financial\/bank-reconciliation\/{bank_reconciliation}","methods":["GET","HEAD"],"parameters":["bank_reconciliation"]},"financial.bank-reconciliation.edit":{"uri":"financial\/bank-reconciliation\/{bank_reconciliation}\/edit","methods":["GET","HEAD"],"parameters":["bank_reconciliation"]},"financial.bank-reconciliation.update":{"uri":"financial\/bank-reconciliation\/{bank_reconciliation}","methods":["PUT","PATCH"],"parameters":["bank_reconciliation"]},"financial.bank-reconciliation.destroy":{"uri":"financial\/bank-reconciliation\/{bank_reconciliation}","methods":["DELETE"],"parameters":["bank_reconciliation"]},"financial.cost-centers.index":{"uri":"financial\/cost-centers","methods":["GET","HEAD"]},"financial.cost-centers.create":{"uri":"financial\/cost-centers\/create","methods":["GET","HEAD"]},"financial.cost-centers.store":{"uri":"financial\/cost-centers","methods":["POST"]},"financial.cost-centers.show":{"uri":"financial\/cost-centers\/{cost_center}","methods":["GET","HEAD"],"parameters":["cost_center"]},"financial.cost-centers.edit":{"uri":"financial\/cost-centers\/{cost_center}\/edit","methods":["GET","HEAD"],"parameters":["cost_center"]},"financial.cost-centers.update":{"uri":"financial\/cost-centers\/{cost_center}","methods":["PUT","PATCH"],"parameters":["cost_center"]},"financial.cost-centers.destroy":{"uri":"financial\/cost-centers\/{cost_center}","methods":["DELETE"],"parameters":["cost_center"]},"employees.create":{"uri":"employees\/create","methods":["GET","HEAD"]},"employees.store":{"uri":"employees","methods":["POST"]},"employees.edit":{"uri":"employees\/{employee}\/edit","methods":["GET","HEAD"],"parameters":["employee"],"bindings":{"employee":"id"}},"employees.update":{"uri":"employees\/{employee}","methods":["PUT"],"parameters":["employee"],"bindings":{"employee":"id"}},"employees.destroy":{"uri":"employees\/{employee}","methods":["DELETE"],"parameters":["employee"],"bindings":{"employee":"id"}},"employees.performance":{"uri":"employees\/{employee}\/performance","methods":["GET","HEAD"],"parameters":["employee"],"bindings":{"employee":"id"}},"employees.commissions.index":{"uri":"employees\/commissions","methods":["GET","HEAD"]},"employees.commissions.store":{"uri":"employees\/commissions","methods":["POST"]},"employees.commissions.update":{"uri":"employees\/commissions\/{commission}","methods":["PUT"],"parameters":["commission"],"bindings":{"commission":"id"}},"employees.commissions.destroy":{"uri":"employees\/commissions\/{commission}","methods":["DELETE"],"parameters":["commission"],"bindings":{"commission":"id"}},"employees.commissions.calculate":{"uri":"employees\/commissions\/calculate\/{order}","methods":["POST"],"parameters":["order"],"bindings":{"order":"id"}},"employees.commissions.pay":{"uri":"employees\/commissions\/pay","methods":["POST"]},"employees.history.index":{"uri":"employees\/{employee}\/history","methods":["GET","HEAD"],"parameters":["employee"],"bindings":{"employee":"id"}},"employees.history.store":{"uri":"employees\/{employee}\/history","methods":["POST"],"parameters":["employee"],"bindings":{"employee":"id"}},"employees.history.destroy":{"uri":"employees\/{employee}\/history\/{history}","methods":["DELETE"],"parameters":["employee","history"],"bindings":{"employee":"id","history":"id"}},"reports.store":{"uri":"reports","methods":["POST"]},"reports.show":{"uri":"reports\/{report}","methods":["GET","HEAD"],"parameters":["report"],"bindings":{"report":"id"}},"reports.download":{"uri":"reports\/{report}\/download","methods":["GET","HEAD"],"parameters":["report"],"bindings":{"report":"id"}},"reports.comments.store":{"uri":"reports\/{report}\/comments","methods":["POST"],"parameters":["report"],"bindings":{"report":"id"}},"reports.comments.update":{"uri":"reports\/{report}\/comments\/{comment}","methods":["PUT"],"parameters":["report","comment"],"bindings":{"report":"id","comment":"id"}},"reports.comments.destroy":{"uri":"reports\/{report}\/comments\/{comment}","methods":["DELETE"],"parameters":["report","comment"],"bindings":{"report":"id","comment":"id"}},"reports.sales.index":{"uri":"reports\/sales","methods":["GET","HEAD"]},"reports.financial.index":{"uri":"reports\/financial","methods":["GET","HEAD"]},"reports.inventory.index":{"uri":"reports\/inventory","methods":["GET","HEAD"]},"reports.customers.index":{"uri":"reports\/customers","methods":["GET","HEAD"]},"reports.products.index":{"uri":"reports\/products","methods":["GET","HEAD"]},"settings.general.index":{"uri":"settings\/general","methods":["GET","HEAD"]},"settings.general.update":{"uri":"settings\/general","methods":["POST"]},"settings.company.index":{"uri":"settings\/company","methods":["GET","HEAD"]},"settings.company.update":{"uri":"settings\/company","methods":["POST"]},"settings.users.index":{"uri":"settings\/users","methods":["GET","HEAD"]},"settings.users.create":{"uri":"settings\/users\/create","methods":["GET","HEAD"]},"settings.users.store":{"uri":"settings\/users","methods":["POST"]},"settings.users.edit":{"uri":"settings\/users\/{user}\/edit","methods":["GET","HEAD"],"parameters":["user"],"bindings":{"user":"id"}},"settings.users.update":{"uri":"settings\/users\/{user}","methods":["PUT"],"parameters":["user"],"bindings":{"user":"id"}},"settings.users.destroy":{"uri":"settings\/users\/{user}","methods":["DELETE"],"parameters":["user"],"bindings":{"user":"id"}},"settings.backup.index":{"uri":"settings\/backup","methods":["GET","HEAD"]},"settings.backup.create":{"uri":"settings\/backup\/create","methods":["GET","HEAD"]},"settings.backup.download":{"uri":"settings\/backup\/{filename}\/download","methods":["GET","HEAD"],"parameters":["filename"]},"settings.backup.destroy":{"uri":"settings\/backup\/{filename}","methods":["DELETE"],"parameters":["filename"]},"register":{"uri":"register","methods":["GET","HEAD"]},"login":{"uri":"login","methods":["GET","HEAD"]},"password.request":{"uri":"forgot-password","methods":["GET","HEAD"]},"password.email":{"uri":"forgot-password","methods":["POST"]},"password.reset":{"uri":"reset-password\/{token}","methods":["GET","HEAD"],"parameters":["token"]},"password.store":{"uri":"reset-password","methods":["POST"]},"verification.notice":{"uri":"verify-email","methods":["GET","HEAD"]},"verification.verify":{"uri":"verify-email\/{id}\/{hash}","methods":["GET","HEAD"],"parameters":["id","hash"]},"verification.send":{"uri":"email\/verification-notification","methods":["POST"]},"password.confirm":{"uri":"confirm-password","methods":["GET","HEAD"]},"password.update":{"uri":"password","methods":["PUT"]},"logout":{"uri":"logout","methods":["POST"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
