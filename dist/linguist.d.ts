export declare class Linguist {
    static detect(filename: string): Language | undefined;
}
export interface Language {
    name: string;
    fileExtensions: string[];
    lineCommentStyle: LineCommentStyle;
    blockCommentStyle?: BlockCommentStyle;
}
interface CommentStyle {
    start: string;
}
interface LineCommentStyle {
    start: string;
}
interface BlockCommentStyle extends CommentStyle {
    continuation: string;
    end: string;
}
export {};
