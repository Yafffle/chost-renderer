function loadFile() {
  const renderedViewElement = document.getElementById('renderedView');
  const editorViewElement	= document.getElementById('editorView');
  const file = document.getElementById('chostFile').files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      // this will then display a text file
      //content.innerText = reader.result;
      renderPost(reader.result, editorViewElement, renderedViewElement);
    },
    false,
  );

  reader.addEventListener(
  	"error",
  	() => {
  		console.error('An error occurred while reading the file: ', reader.error);
  	},
  	false,
  );

  if (file) {
    reader.readAsText(file);
  }
}

function renderPost(text, editorViewElement, renderedViewElement) {
	marked.use({breaks: true});

	const obj 		= JSON.parse(text);
	const blocks 	= obj.blocks;
	const tags		= obj.tags;

	renderedViewElement.innerHTML = "";

	var blockContent 	= null;
	var editorText 		= "";
	var renderedText	= "";
	var tagsSpan		= null;
	var tagsLine		= "";

	if (obj.headline != "")
	{
		editorText = "<h3>" + obj.headline + "</h3>" + "\n\n";
		renderedText = marked.parse("### " + obj.headline);
	}

	blocks.forEach((block) => {
		if(block.type == "markdown")
		{
			blockContent = block.markdown.content;
			blockContent = blockContent.replaceAll('\n','\\n');
			editorText += blockContent + "\n\n";
			
			blockContent 	= block.markdown.content;
			renderedText 	+= marked.parse(blockContent);
		}
	});

	if(tags.length > 0)
	{
		tags.forEach((tag) => {
			tagsLine += "#" + tag + " ";
		});

		editorText += tagsLine;

		tagsSpan 			= document.createElement('p');
		tagsSpan.innerText	= tagsLine;
		tagsSpan.setAttribute("id", "tagLine");
	}

	editorViewElement.innerText = editorText;
	renderedViewElement.insertAdjacentHTML('afterbegin', renderedText);
	
	if(tagsSpan != null) renderedViewElement.append(tagsSpan);
}