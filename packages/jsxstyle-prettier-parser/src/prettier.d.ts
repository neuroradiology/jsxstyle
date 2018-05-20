import * as prettier from 'prettier';

declare module 'prettier' {
  // TODO: submit PR to @types/prettier
  // function getFileInfo(
  //   filePath: string,
  //   options: prettier.Options
  // ): Promise<{ ignored: boolean; inferredParser: string | null }>;

  function getSupportInfo(
    version: null,
    options: prettier.Options
  ): prettier.SupportInfo;

  interface Options {
    printer?: prettier.Printer;
    astFormat?: string;
  }
}
