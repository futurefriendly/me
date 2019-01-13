<nav id="nav" class="navigation" role="navigation">
<ul>
{%foreach $data as $doc%}
<li class="active">
<a href="#section-{%$doc@index|f_escape_path%}">
<i class="icon-{%$doc.icon|f_escape_xml%} icon-white"></i><span>{%$doc.title|f_escape_xml%}</span>
</a>
</li>
{%/foreach%}
</ul>
</nav>