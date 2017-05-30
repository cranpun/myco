import { Sites } from "./sites";
import { Conf } from "./conf";
import { Page } from "./page";
import { Pagesdb } from "./pagesdb";

Conf.init();
Pagesdb.init();

Sites.parse();
