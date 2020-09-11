HtmlTag = openTag:HtmlOpen child:(HtmlTag/Html/MustacheExpression)* HtmlClose? {
  return {
   view:openTag,
   child:child
  } 
}

HtmlOpen = StartOpenTag word: Identifier _* option:(HtmlOpenOption)* EndOpenTag {
  const result = {
     tag:word,
     events:[],
     attr:[]
  }
  option.forEach(val=>{
    const key = Object.keys(val)[0];
    switch(key){
      case 'event':
        result.events.push(val[key]);break;
      case 'attr':
        result.attr.push(val[key]);break;
      default:
        result[key] = val[key]   
    }
  });
 return result;
}

HtmlOpenOption = value:((If/ElseIf/Else)/Model/For/(Event)/Attribute/InnerHtml) _* {
  const key = Object.keys(value)[0];
  return {
     [key]:value[key]
  }
}

HtmlClose = StartCloseTag word: Identifier EndTag{
  return word
}

Ws "Whitespace" = [ \t];

_ "One or more whitespaces" = space:Ws+ {return null;}


If= "#if(" exp:Expression ")"{
   return {ifExp: {ifCond:exp}};
}

ElseIf= "#else-if(" exp:Expression ")"{
   return {ifExp: {elseIfCond:exp}};
}
Else= "#else"{
   return {ifExp: {else:true}}
}

Model= "#model" "(" word:Identifier ")"{
   return {model:word};
}

For= "#for("_* key:Identifier _* index:ForIndex?  _* "in" _* value:Expression _* ")"{
   return {forExp:{
      key, value,index : index || 'i'
   }}
}

Attribute= isBind:":"? attr:Identifier _* "=" StringSymbol word:Word StringSymbol _*{
   return {attr: {key:attr,value:word, isBind:isBind!=null}};
}

ForIndex = "," _* index:Identifier{
	return index ;
}

InnerHtml= "#html" _* "=" StringSymbol? val:Identifier StringSymbol? {
   return {html: val};
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
	return {event: {name:event, handler:handler}};
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

Word "word" = val:[a-zA-Z0-9\&\ \|\.\$\!\=\-]+ {
	return val.join("");
}
