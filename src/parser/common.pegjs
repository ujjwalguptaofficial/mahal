Exp =  HtmlTag

HtmlTag = openTag:HtmlOpen child:(HtmlTag/Html/MustacheExpression)* HtmlClose {
  return {
   view:openTag,
   child:child
  } 
}

HtmlOpen = StartOpenTag word: Identifier Ws* ifExp:(If/ElseIf/Else)? forExp:For? ev:Event* Ws* EndTag {
  
  return {
    tag:word,
    ifExp: ifExp,
    events:ev,
    forExp:forExp
  }
}

HtmlClose = StartCloseTag word: Identifier EndTag{
  return word
}

Ws "Whitespace" = [ \t];

_ "One or more whitespaces" = space:Ws+ {return null;}


If= "#if(" exp:Expression ")"{
   return {ifCond:options.createFnFromStringExpression(exp)};
}

ElseIf= "#else-if(" exp:Expression ")"{
   return {elseIfCond:options.createFnFromStringExpression(exp)};
}
Else= "#else"{
   return {else:true}
}

For= "#for("_* key:Identifier _* "in" _* value:Identifier _* ")"{
   return {
      key, value: options.createFnFromStringExpression(value)
   }
}

StartOpenTag "<" = [<];
StartCloseTag "</" = [<][/]; 

EndTag ">" = [>];

Identifier "identifier"= val:[a-zA-Z]+ {
	return val.join("");
}

MustacheExpression "mustache expression" = "{{" val:Expression "}}"+ {
	return {mustacheExp:val};
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
