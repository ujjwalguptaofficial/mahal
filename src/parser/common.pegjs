Exp =  View
View = HtmlTag
HtmlTag = openTag:HtmlOpen child:(HtmlTag/Html/MustacheExpression)* HtmlClose {
  //return new Function('ctx', "return "+ open.ifExp).toString()
  let str= "";
  child.forEach(item=>{
    if(item.mustacheExp){
      str+=item.mustacheExp.toString()+",";
    }
    else if(typeof item=='function'){
       str+=item.toString()+",";
    }
    else{
      str+="createEement('"+item+"'),";
    }
  })
  const fn = new Function('ctx', "return "+ "createElement('"+  openTag.tag +"',["+ str +"])")
  //return fn;
  return {
   view:openTag,
   child:child
  } 
}

HtmlOpen = StartOpenTag word: Identifier Ws* ifExp:If? ev:Event* Ws* EndTag {
  
  return {
    tag:word,
    ifExp: ifExp,
    events:ev
  }
}

HtmlClose = StartCloseTag word: Identifier EndTag{
  return word
}

Ws "Whitespace" = [ \t];

_ "One or more whitespaces" = space:Ws+ {return null;}

If= "#if(" exp:Expression ")"{
   return options.createFnFromStringExpression(exp);
}

For= "#for(" exp:Expression ")"{
   return exp;
}

StartOpenTag "<" = [<];
StartCloseTag "</" = [<][/]; 

EndTag ">" = [>];

Identifier "identifier"= val:[a-zA-Z]+ {
	return val.join("");
}

MustacheExpression "mustache expression" = "{{" val:Expression "}}"+ {
	return {mustacheExp:options.createFnFromStringExpression(val)};
}

Event "event syntax" = "on:" event:Expression "='" handler:Identifier "'"+ {
	return {name:event, handler:handler};
}

Expression "Expression"= val:[a-zA-Z\&\ \|]+ {
	return val.join("");
}

Html "html"= val:[a-zA-Z\&\ \|]+ {
	return val.join("");
}
