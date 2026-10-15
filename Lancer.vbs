Option Explicit
Dim fs, shell, root, exe
Set fs = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
root = fs.GetParentFolderName(WScript.ScriptFullName)
exe = fs.BuildPath(root, "Laboratoire pedagogique IA.exe")
If Not fs.FileExists(exe) Then exe = fs.BuildPath(root, "src-tauri\target\release\laboratoire-pedagogique-ia.exe")
If fs.FileExists(exe) Then
  shell.Run Chr(34) & exe & Chr(34), 1, False
Else
  MsgBox "L'application native n'est pas encore compilee. Consultez LISEZ-MOI.md dans ce dossier.", 64, "Laboratoire pedagogique IA"
End If