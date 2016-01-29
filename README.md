# Predictive Shopping List

##Overview:

The goal of this project is to create a user friendly predictive shopping list app. This app will have several shopping lists: Current Shopping List, Next Shopping List and Following Shopping List, etc. Each list will contain a list products in semantic form (i.e. Milk, Bread, Eggs) that can be postponed to a later list or, if in a any list other than the current list, pushed forward to a more recent list.

To generate the lists, users will enter a barcode (which for my app will be a barcode capture via my cell phone and sent to the input field). On submit, I will use a consumer product API to look up the product and display product info such as picture, brand, description, price, etc. The next step is for the user to give the item a semantic name that will be stored as the value for the product object key. The user will also need to input when they think the next time they would need this itme would be. 

An example of this process would be:
1. User inputs 011110502476 via smart phone barcode scan.
2. This returns: 1 Gal King Super Milk 2%
3. The user labels this as Milk which is what gets displayed in there shopping list.
4. The user estimates that they need 1 Gal of milk every X (days, weeks, months, etc.)
5. This item is added to the cart at the frequency listed above.

##Mockups 
Hand drawn - see me for details.

##Technologies:
HTML for pages
CSS for styling - probably using Bootstrap and a Bootswatch theme.
Javascript for logic and prediction
JQuery for DOM manipulation - Displaying product info after barcode submit
AJAX - for API request for product info
Indix API - contains endpoints for millions of consumer products


##Stretch:

1. Ideally, this app would recognize when items are moved from the originally assigned list to a more or less recent list and update future predictions based upon these user actions.
2. The app would recgonize that some products relate to specific stores. For exmaple, King Supers in-house brand, Kirklands from Costco, Trader Joe's house brand etc, and manage/display products accordingly.
3. Connect this to additional APIs (Photo Barcode recognition and Dropbox connector) so that any user can take a photo of the barcode which gets automatically uploaded to a specific (public) DropBox folder and use a connector to poll this DropBox foler for new images. If new images exist these are sent to a Photo Barcode recognition API that interprets the barcode from the picture and adds it to the users lists as per above.