Exp =  View
View = HtmlTag
HtmlTag = open:HtmlOpen child:(HtmlTag/Html)* HtmlClose {
  return {
   view:open,
   child:child
  } 
}

HtmlOpen = StartOpenTag word: Identifier Ws* ifExp:If? EndTag {
  return {
    tag:word,
    ifExp:ifExp
  }
}

HtmlClose = StartCloseTag word: Identifier EndTag{
  return word
}

Ws "Whitespace" = [ \t];

_ "One or more whitespaces" = space:Ws+ {return null;}

If= "#if(" exp:Expression ")"{
   return exp;
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
