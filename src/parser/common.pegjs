Exp =  View
View = HtmlTag
HtmlTag = open:HtmlOpen child:(HtmlTag/Html)* HtmlClose {
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
   return new Function('ctx', "return "+ exp.split(" ").map(item => {
                    switch (item) {
                        case '&&':
                        case '||':
                        case 'true': 
                        case 'false': return item;
                        default: return "ctx." + item;
                    }
                }).join(" ")) 
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

Expression "Expression"= val:[a-zA-Z\&\ \|]+ {
	return val.join("");
}

Html "Expression"= val:[a-zA-Z\&\ \|]+ {
	return val.join("");
}

Letter = [^'%]
Word "word"= l:Letter+ {return l.join("");}
