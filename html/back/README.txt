Kleines HOW-TO

Die Einstiegsseite für's Backend ist: login.html, von dort gelangt man dann zu Administration.html.

Die einzelnen Unterseiten werden Oldschool realisiert.
Header, Nav-Bar und Footer sind also in jeder Unterseite.html vorhanden.

Das CSS stellt drei Spalten [col-left, col-center, col-right] bereit, um die Seitenaufteilung des Mockup zu realisieren. (15%|70%|15%)
Der Seiteninhalt kommt zwischen die HTML5 Tags <article>. Die Unterseiten-Templates enthalten dort bereits eine "row" mit jeweils den passenden <div> für jede Spalte:

<div class="row content">
  <div class = "col-left"></div>

   <div class = "col-center">
     <h2>Home</h2>
    Inhalt
   </div>

  <div class = "col-right"></div>
</div>

Auch leere Spalten müssen als <div> vorhanden sein.

die col-center Spalte ist nachher offensichtlich in der Mitte und deshalb als mit Inhalt zu befüllende Spalte vorgesehen.

Zwischen "rows" können andere Inhalte eingefügt werden die dann über die gesamte Seitenbreite gehen. z.B. "bumper" als Thematrenner für die Homeseite.
