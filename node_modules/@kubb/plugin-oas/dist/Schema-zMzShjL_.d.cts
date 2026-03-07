import * as react from 'react';
import { ReactNode } from 'react';
import * as KubbFile from '@kubb/fs/types';
import { SchemaObject } from '@kubb/oas';
import { KubbNode } from '@kubb/react';
import { S as Schema$1 } from './SchemaMapper-BpjlzuXc.cjs';

type SchemaContextProps = {
    name: string;
    schema?: SchemaObject;
    tree: Array<Schema$1>;
};
type Props = {
    name: string;
    value?: SchemaObject;
    tree?: Array<Schema$1>;
    children?: KubbNode;
};
declare function Schema({ name, value, tree, children }: Props): KubbNode;
declare namespace Schema {
    var File: ({ output, isTypeOnly, children }: FileProps) => ReactNode;
    var Imports: ({ isTypeOnly, extName }: SchemaImportsProps) => ReactNode;
    var Context: react.Context<SchemaContextProps>;
}
type FileProps = {
    isTypeOnly?: boolean;
    output: string | undefined;
    children?: KubbNode;
};
type SchemaImportsProps = {
    isTypeOnly?: boolean;
    extName?: KubbFile.Extname;
};

export { Schema as S, type SchemaContextProps as a };
