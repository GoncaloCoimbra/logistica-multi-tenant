import { O as Oas } from './Oas-Br0yKhGF.js';
import { OASDocument } from 'oas/types';
import 'oas';
import 'oas/operation';

declare function parse(pathOrApi: string | OASDocument, oasClass?: typeof Oas): Promise<Oas>;

export { parse };
