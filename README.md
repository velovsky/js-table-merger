# Table-Merger.js
Analogous to MS Word table tool, **Table-Merger.js** let's you merge cells of a HTML table object. Only squares and rectangles shapes are merged. This method could be helpful on managing the layout or content of your webpage. For example, in a dashboard context, this tool could help the end-user to configure its desired layout.
At the moment this is a simple **jQuery** tool that enables cells to be merged. If more public exposure is gained, the API could be further optimized and new methods added.

Feel free to contribute or comment :)

*Tested in Chrome and IE(v11) browsers.*

### Example

[Here](https://rawgit.com/velovsky/js-table-merger/master/src/merger.html) is an example, where you can build different tables and test the tool.

## Installing

Download "table-merger" *js* and *css* files in *src* folder, and add them to your html file:
```
<script src="...src/js/table-merger.js" charset="utf-8"></script> 
<link rel="stylesheet" href="...src/css/table-merger.css">
```

### Quick guide through

Once you have added the script/css files, simply call the ```table_merger``` method:
```
table_merger('#table_id');
```
For a given table with *table_id* id, all its *td* (cell) elements with *selected* class will be merged (see example section). If for some reason you want to assign a different class name, you can call the same method with an additional parameter:
```
table_merger('#table_id','cells_to_merge_class');
```
To sum up, ```table_merger``` method has two string inputs:

 1. **table_id** string prefixed with "#". If no parameter given, a console error will be outputted. If table id is not valid, nothing will be returned by the API;
 2. **merge_cell_class** string (optional). A string with the exact name of the cells class (no "." prefix is required). This is only inputted if you want to assign a different class to the cells that are to be merged.

## Dependencies

* [jQuery](https://jquery.com/download/) - ```v3.2.x``` (if requested, it could be jQuery independent)

*OBS:* File available inside the *lib* folder.