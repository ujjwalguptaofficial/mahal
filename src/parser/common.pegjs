Exp =  View
View = HtmlTag
HtmlTag = open:HtmlOpen child:(HtmlTag/Html/MustacheExpression)* HtmlClose {
  //return new Function('ctx', "return "+ open.ifExp).toString()
  return {
   view:open,
   child:child
  } 
}

HtmlOpen = StartOpenTag word: Identifier Ws* ifExp:If? EndTag {
  
  return {
    tag:word,
    ifExp: ifExp
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

Expression "Expression"= val:[a-zA-Z\&\ \|]+ {
	return val.join("");
}

Html "html"= val:[a-zA-Z\&\ \|]+ {
	return val.join("");
}
