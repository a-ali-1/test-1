Kleines HOW-TO

Die Einstiegsseite für's Frontend ist: Home.html

Die einzelnen Unterseiten werden Oldschool realisiert.
Header, Nav-Bar und Footer sind also in jeder Unterseite.html vorhanden.

*Durch Bootstrap-Grid ersetzt*
>Das CSS stellt drei Spalten [col-left, col-center, col-right] bereit, um die Seitenaufteilung des Mockup zu realisieren. (15%|70%|15%)
# Bootstrap
- Jedes Element der Klasse __row__ erhält die Klasse __text-center__
## Bootstrap-Grid
__Rows__ haben die Klasse __py-3__
Anordnund der Elemente in einer Row in __lg__:
- __col-lg-1__ __col-lg-5__ __col-lg-5__ __col-lg-1__
  - beide __col-lg-5__ haben jeweils noch die Klasse __mx-3__
Elemente mit der Klasse Bumper erhalten noch die Klasse __p-1__

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


Die Seiten die nicht über das Menü erreicht werden können, werden innerhalb des html-Prototyps logischerweise einfach mithilfe der Fake-Buttons verlinkt.
Erledige ich noch:
- bumper hübsch machen
