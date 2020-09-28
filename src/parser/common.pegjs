HtmlTag = HtmlTagClosing/HtmlTagSelfClosing

HtmlTagClosing = openTag:HtmlOpen EndTag child:(HtmlTag/Html/MustacheExpression)* CloseTag {
  return {
   view:openTag,
   child: child.filter(item=> {
      return item!=null && typeof item==='string'?item.trim().length!==0:true
   })
  }
}

HtmlTagSelfClosing = openTag:HtmlOpen "/" EndTag {
  return {
    view:openTag
  }
}

HtmlOpen = StartOpenTag word: Identifier _* option:(HtmlOpenOption)* {
  const result = {
     tag:word,
     events:[],
     attr:[],
     dir:{}
  }
  option.forEach(val=>{
    const key = Object.keys(val)[0];
    switch(key){
      case 'event':
        result.events.push(val[key]);break;
      case 'attr':
        result.attr.push(val[key]);break;
       case 'dir':
         const dirValue = val[key];
         result.dir[dirValue.name]=dirValue.value;
         break;
      default:
        result[key] = val[key]   
    }
  });
  if(Object.keys(result.dir).length===0){
     delete result.dir;
  }
 return result;
}

HtmlOpenOption = value:((If/ElseIf/Else)/For/(Event)/Attribute/InnerHtml/Directive) _* {
  const key = Object.keys(value)[0];
  return {
     [key]:value[key]
  }
}

CloseTag "close tag"= StartCloseTag word: Identifier EndTag{
  return word
}


Ws "Whitespace" = [ \t];

_ "One or more whitespaces" = space:Ws+ {return null;}

Directive "directive" = "#" name:Word value:DirectiveValue? {
   return {dir:{
      name,
      value: value || []
   }};
}

DirectiveValue = "(" expFirst:Expression _* expRest:DirectiveRestValue* ")" {
   expRest.unshift(expFirst);
   return expRest
}

DirectiveRestValue =  "," exp:Expression _* {
  return exp;
}

If= "#if(" exp:Expression ")"{
   return {ifExp: {ifCond:exp}};
}

ElseIf= "#else-if(" exp:Expression ")"{
   return {ifExp: {elseIfCond:exp}};
}
Else= "#else"{
   return {ifExp: {else:true}}
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


Identifier "identifier"= val:[a-zA-Z\$]+ {
	return val.join("");
}

MustacheExpression "mustache expression" = "{{" val:Html filters:Filter* _*  "}}"+ {
	return {mustacheExp:val , filters};
}

Filter "filter" = _* "|" _* val:Identifier {
  return val;
}

Event "event syntax" = "on:" event:Identifier modifier:EventModifier* "=" handlers:EventHandlers {
	 let isNative=false;
     const option = {};
     const modifierFiltered = [];
     modifier.forEach(item=>{
       if(["capture","once","passive"].includes(item)){
         option[item]=true
       }
       else if(item==="native"){
         isNative=true
       }
       else {
         modifierFiltered.push(item)
       }
     });
    return {event: {name:event, handlers,option, isNative,modifiers:modifierFiltered }};
}

EventHandlers = ev:(EventHandler/EventHandlersChanined){
  return Array.isArray(ev)? ev: [ev]
}

EventHandlersChanined = "{" _* ev1:EventHandler evRest:EventHandlerWithPipe* _* "}" {
   evRest.unshift(ev1);
   return evRest;
}

EventHandlerWithPipe = _* "|" _* ev: EventHandler{
  return ev;
}

EventHandler = StringSymbol handler:EventAssignment StringSymbol {
  return handler
}

EventModifier "event modifier" = "."  value:Identifier {
  return value;
}

Expression = ObjectExpression/(ExpressionWithConnector)*

ObjectExpression = "{" exp:ExpressionWithConnector* expRest:ObjectExpressionRest* "}" {
   expRest.forEach(item=>{
     exp = exp.concat(item)
   });
   const lastIndex = exp.length -1;
   exp[0].exp.left = '{' + exp[0].exp.left;
   const lastRight = exp[lastIndex].exp.right;
   exp[lastIndex].exp.right =   (lastRight==null?'':lastRight) + '}';
   //console.log("exp",exp);
   return exp;
}

ObjectExpressionRest = "," exp:ExpressionWithConnector* {
  exp[0].exp.left= "," + exp[0].exp.left;
  return exp;
}

ExpressionWithConnector = exp:SingleExpression op:Connector? {
 return {exp,op}
}

SingleExpression = _* left:ExpWord _* op:Operator? _* right:ExpWord? _* {
  return {
   left,op,right
  }
}

Connector = val:[&\|\:]+ {
  return val.join("");
}

Operator = val:[>\=\<\!]+ {
  return val.join("");
}

ExpWord "expression" = val:[a-zA-Z0-9\.\$\-\'\"]+ {
	return val.join("");
}

EventAssignment "Event Assignment"= val:[a-zA-Z0-9\&\=\>\{\}\(\)\ \|\[\]]+ {
	return val.join("");
}

Html "html"= val:[a-zA-Z0-9\&\ \.\$\n\r\"\']+ {
	return val.join("").replace(/[\n\r]/gm, "").replace(/\s\s+/g, ' ');
}

StringSymbol "string" = ['/"]

Word "word" = val:[a-zA-Z0-9\&\ \|\.\$\!\=\-\:\;]+ {
	return val.join("");
}
