Exp =  HtmlTag

HtmlTag = openTag:HtmlOpen child:(HtmlTag/Html/MustacheExpression)* HtmlClose? {
  return {
   view:openTag,
   child:child
  } 
}

HtmlOpen = StartOpenTag word: Identifier Ws* ifExp:(If/ElseIf/Else)? _* model:Model? forExp:For? ev:Event* Ws* attr:Attribute* html:InnerHtml? EndOpenTag {
  
  return {
    tag:word,
    ifExp: ifExp,
    events:ev,
    forExp:forExp,
    attr:attr,
    model,
    html
  }
}

HtmlClose = StartCloseTag word: Identifier EndTag{
  return word
}

Ws "Whitespace" = [ \t];

_ "One or more whitespaces" = space:Ws+ {return null;}


If= "#if(" exp:Expression ")"{
   return {ifCond:exp};
}

ElseIf= "#else-if(" exp:Expression ")"{
   return {elseIfCond:exp};
}
Else= "#else"{
   return {else:true}
}

Model= "#model" "(" word:Identifier ")"{
   return word;
}

For= "#for("_* key:Identifier _* index:ForIndex?  _* "in" _* value:Expression _* ")"{
   return {
      key, value,index : index || 'i'
   }
}

Attribute= isBind:":"? attr:Identifier _* "=" StringSymbol word:Identifier StringSymbol _*{
   return {key:attr,value:word, isBind:isBind!=null};
}

ForIndex = "," _* index:Identifier{
	return index ;
}

InnerHtml= "#html" _* "=" StringSymbol? val:Identifier StringSymbol? {
   return val;
}

StartOpenTag "<" = [<];
StartCloseTag "</" = [<][/]; 

EndTag ">" = [>];

EndOpenTag ">" = "/"? [>];

Identifier "identifier"= val:[a-zA-Z\$]+ {
	return val.join("");
}

MustacheExpression "mustache expression" = "{{" val:Html or:MustacheOr?  filters:Filter* _*  "}}"+ {
	return {mustacheExp:val + (or ? or :''), filters};
}

Filter "filter" = _* "|" _* val:Identifier {
  return val;
}

MustacheOr = "||" or:Html{
  return "||" +or;
}

Event "event syntax" = "on:" event:Identifier "=" StringSymbol handler:EventAssignment StringSymbol+ {
	return {name:event, handler:handler};
}

Expression "Expression"= val:[a-zA-Z0-9\&\ \|\.\$\!\=]+ {
	return val.join("");
}

EventAssignment "Event Assignment"= val:[a-zA-Z0-9\&\=\>\{\}\(\)\ \|]+ {
	return val.join("");
}

Html "html"= val:[a-zA-Z\&\ \.\$\n\r]+ {
	return val.join("").replace(/[\n\r]/gm, "").replace(/\s\s+/g, ' ');
}

StringSymbol "string" = ['/"]
