#!/usr/bin/ruby

require "yaml"
require "cinch"
require "pusher"

settings = YAML.load_file( 'pusher_settings.yml' )
Pusher.app_id = settings[:app_id]
Pusher.key = settings[:key]
Pusher.secret = settings[:secret]

def send(m, message, opts=nil)
    begin
        Pusher[m.channel.name.gsub(/#/, '')].trigger(message, opts)
        yield
    rescue Pusher::Error => err
        m.reply "ERROR: #{err}"
    end
end

module KnowsAdmins
    Admins = ["brendanjerwin","Contejious", "cubanx"]

    def is_admin?(user)
        user.refresh # be sure to refresh the data, or someone could steal
                     # the nick
        Admins.include?(user.authname)
    end
end

class Autovoice
  include Cinch::Plugin
  include KnowsAdmins

  listen_to :join
  match /autovoice (on|off)$/

  def listen(m)
    unless m.user.nick == bot.nick
      m.channel.voice(m.user) if @autovoice
    end
  end

  def execute(m, option)
    return unless is_admin?(m.user)

    @autovoice = option == "on"

    m.reply "Autovoice is now #{@autovoice ? 'enabled' : 'disabled'}"
  end
end

class StatusBoard
    include Cinch::Plugin

    match /reload board/, :method => :reload
    match /callout (.*)/, :method => :callout
    match /standup/, :method => :standup
    match /set (\w+) to (.*)/, :method => :set_url
    match /[tnw_status_board] (\w+) pushed .* commit to gh-pages/, :method => :board_changed
    match /youtube (.*)/ ,:method => :youtube
    match /sound (.*)/, :method => :sound

    match /do (\w+)$/, :method => :do
    match /do_set (\w+) (.*)$/, :method => :do_set
    match /do_clear (\w+) (.*)$/, :method => :do_clear
    match /do_list/, :method => :do_list


    def board_changed(m, who)
        m.reply "#{who} seems to have changed the board, I think its time to reload."
        reload m
    end

    def set_url(m, pane, url)
        send m, 'set_url', {:pane => pane, :url => url} do
            m.reply "URL Set"
        end
    end

    def standup(m)
        length = 10
        send m, 'start_standup', length do
            m.reply "ALL RISE! For #{length} minutes."
        end
    end

    def reload(m)
        send m, 'reload_board' do
            m.reply "Reload command sent."
        end
    end

    def youtube(m, id)
        send m, 'set_callout', type: :youtube, content: id do

        end
    end

    def sound(m, url)
        send m, 'play_sound', url do

        end
    end

    def callout(m, content)
        #data {timeout, type, content}
        #types [image, url, text]

        type = :text
        timeout = 20
        if content =~ /^http(|s):\/\/.*/
            type = :url
            timeout = 120
            if content =~ /\.(png|gif|jpg|jpeg)$/
                type = :image
                timeout = 30
            else
                m.channel.topic = "#{m.user.nick} thinks you should see: #{content}"
            end
        end

        if type == :text
            content = "&#8220;#{content}&#8221; -- #{m.user.nick}"
        end

        send m, 'set_callout', timeout: timeout, type: type, content: content do
            m.reply "I set the callout for you."
        end
    end

    def load_commands
        return @commands unless @commands.nil?
        commands = YAML.load_file( 'do_commands.yml' )
        commands = {} if commands == false
        return commands
    end

    def save_commands(commands)
        File.open( 'do_commands.yml', 'w' ) do |out|
            YAML.dump( commands, out )
        end
    end

    def do(m, word)
        @commands = load_commands
        puts @commands[word]
        @commands[word].split("|").each { |command| m.reply command }
    end

    def do_set(m, word, cmd)
        @commands = load_commands
        @commands[word] = cmd
        save_commands @commands
        m.reply "You stored: #{word} to do: #{cmd}"
    end

    def do_clear(m, word)
        @commands = load_commands
        @commands.delete(word)
        save_commands @commands
        m.reply "You cleared: #{word}"
    end

    def do_list(m)
        @commands = load_commands
        m.reply "AVAILABLE DO COMMANDS:"
        @commands.keys.sort.each do |key|
            m.reply "  #{key} => \"#{@commands[key]}\""
        end
    end
    
end

class Sentry
  include Cinch::Plugin
  include KnowsAdmins

  listen_to :join

  def listen(m)
    unless m.user.nick == bot.nick
        m.channel.op(m.user) if is_admin?(m.user)
    end
  end

end

bot = Cinch::Bot.new do
  configure do |c|
    c.nick = "tnw_beaker"
    c.server = 'irc.freenode.net'
    c.channels = ["#tnw_dev_cobalt", "#tnw_dev_carbon", "#tnw_dev_iron"]
    c.plugins.plugins = [Sentry, Autovoice, StatusBoard]
  end
end

bot.start
