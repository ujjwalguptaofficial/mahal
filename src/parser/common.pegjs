Exp =  HtmlTag

HtmlTag = openTag:HtmlOpen child:(HtmlTag/Html/MustacheExpression)* HtmlClose {
  return {
   view:openTag,
   child:child
  } 
}

HtmlOpen = StartOpenTag word: Identifier Ws* ifExp:(If/ElseIf/Else)? model:Model? forExp:For? ev:Event* Ws* attr:Attribute? EndTag {
  
  return {
    tag:word,
    ifExp: ifExp,
    events:ev,
    forExp:forExp,
    attr:attr,
    model
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

For= "#for("_* key:Identifier _* index:ForIndex?  _* "in" _* value:Identifier _* ")"{
   return {
      key, value,index : index || 'i'
   }
}

Attribute= attr:Identifier _* "=" "'" word:Identifier "'"{
   return {[attr]:word};
}

ForIndex = "," _* index:Identifier{
	return index ;
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
