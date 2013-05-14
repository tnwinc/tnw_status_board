interactor :off

guard 'coffeescript', :input => 'src', :output => 'build' do
  watch(%r{^src[/](.+\.coffee)})
end

guard 'compass' do
  watch(%r{(^.+\.scss)})
end

#guard 'livereload' do
#  watch(%r{(^.+\.coffee)})
#  watch(%r{(^.+\.s[ac]ss)})
#  watch(%r{(^.+\.js)})
#end
